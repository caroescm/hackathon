"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { CalendarPlus, X } from "lucide-react";

const SERVICIOS = [
  "Oncología Médica",
  "Cirugía Oncológica",
  "Radioterapia",
  "Quimioterapia",
  "Laboratorio",
  "Imágenes / Radiología",
  "Nutrición Oncológica",
  "Psicología Oncológica",
  "Trabajo Social",
  "Farmacia",
];

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

interface Props {
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function SolicitarCita({ triggerLabel, triggerClassName }: Props = {}) {
  const supabase = createClient();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [servicio, setServicio] = useState(SERVICIOS[0]);
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fecha) { setError("Selecciona una fecha preferida."); return; }
    if (fecha < hoyISO()) { setError("La fecha no puede ser anterior a hoy."); return; }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sesión expirada. Recarga la página."); setLoading(false); return; }

    const { error: dbError } = await supabase.from("citas").insert({
      paciente_id: user.id,
      servicio,
      fecha,
      estado: "programada",
    });

    setLoading(false);

    if (dbError) {
      setError(`Error al registrar la solicitud: ${dbError.message}`);
      return;
    }

    setEnviado(true);
    router.refresh();
  }

  function cerrarModal() {
    setIsOpen(false);
    setServicio(SERVICIOS[0]);
    setFecha("");
    setError("");
    setEnviado(false);
  }

  return (
    <>
      {triggerLabel ? (
        <button className={triggerClassName} onClick={() => setIsOpen(true)}>
          {triggerLabel}
        </button>
      ) : (
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <CalendarPlus size={16} />
          Solicitar cita
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cerrarModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Solicitar cita</h2>
              <button
                onClick={cerrarModal}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {enviado ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CalendarPlus size={24} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  ¡Solicitud enviada correctamente!
                </p>
                <p className="text-xs text-muted">
                  El equipo del INEN revisará tu solicitud y confirmará la fecha y hora de tu cita.
                </p>
                <Button variant="secondary" size="sm" onClick={cerrarModal}>
                  Cerrar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-muted leading-relaxed">
                  Indica el servicio y tu fecha preferida. El personal del INEN confirmará la
                  cita y te notificará.
                </p>

                {/* Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Servicio <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={servicio}
                    onChange={(e) => { setServicio(e.target.value); setError(""); }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {SERVICIOS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Fecha preferida */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fecha preferida <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    min={hoyISO()}
                    onChange={(e) => { setFecha(e.target.value); setError(""); }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-muted">
                    Esta es tu preferencia — la fecha final la confirma el INEN.
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={cerrarModal}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={loading}
                    disabled={!fecha}
                  >
                    Enviar solicitud
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
