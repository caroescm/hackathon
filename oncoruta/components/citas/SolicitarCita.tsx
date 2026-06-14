"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { CalendarPlus, X, CheckCircle } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

const SERVICIOS = [
  "Oncología Médica",
  "Quimioterapia",
  "Radioterapia",
  "Cirugía Oncológica",
  "Diagnóstico por Imágenes",
  "Nutrición Oncológica",
  "Psicología Oncológica",
  "Trabajo Social",
];

function mananaISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

interface Props {
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function SolicitarCita({ triggerLabel, triggerClassName }: Props = {}) {
  const supabase = createClient();
  const router = useRouter();
  const { idioma } = useIdioma();

  const [isOpen, setIsOpen] = useState(false);
  const [servicio, setServicio] = useState(SERVICIOS[0]);
  const [fecha, setFecha] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError(idioma === "es" ? "Sesión expirada. Recarga la página." : "Sesión tukun. Kutichimuytaq.");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("citas").insert({
      paciente_id: user.id,
      servicio,
      fecha: fecha || null,
      notas: notas.trim() || null,
      estado: "solicitada",
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
    setNotas("");
    setError("");
    setEnviado(false);
  }

  const es = idioma === "es";

  return (
    <>
      {triggerLabel ? (
        <button className={triggerClassName} onClick={() => setIsOpen(true)}>
          {triggerLabel}
        </button>
      ) : (
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <CalendarPlus size={16} />
          {es ? "Solicitar cita" : "Tupanakuy mañay"}
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={cerrarModal} />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {es ? "Solicitar cita" : "Tupanakuy mañay"}
              </h2>
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
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {es ? "¡Solicitud enviada!" : "¡Mañakuyki kachasqaña!"}
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  {es
                    ? "Tu solicitud fue enviada. El equipo del INEN te confirmará la cita."
                    : "Mañakuyki kachasqaña. INEN-manta runakuna tupanakuykita nisunkiku."}
                </p>
                <Button variant="secondary" size="sm" onClick={cerrarModal}>
                  {es ? "Cerrar" : "Wichqay"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-muted leading-relaxed">
                  {es
                    ? "Indica el servicio y tu fecha preferida. El equipo del INEN revisará tu solicitud y te confirmará la cita."
                    : "Hampiq wasipi imata munasqaykita nin. INEN-manta runakuna tupanakuykita nisunkiku."}
                </p>

                {/* Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {es ? "Servicio" : "Hampiy ñan"} <span className="text-red-500">*</span>
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
                    {es ? "Fecha preferida" : "Munasqa p'unchay"}{" "}
                    <span className="text-gray-400 font-normal">
                      {es ? "(Opcional)" : "(Mana wakichisqachu)"}
                    </span>
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    min={mananaISO()}
                    onChange={(e) => { setFecha(e.target.value); setError(""); }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-muted">
                    {es
                      ? "Esta es tu preferencia — la fecha final la confirma el INEN."
                      : "Kaymi munasqayki — p'unchay runan INEN-mi nisunki."}
                  </p>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {es ? "Motivo o indicaciones adicionales" : "Imapaqmi o yapa willay"}{" "}
                    <span className="text-gray-400 font-normal">
                      {es ? "(Opcional)" : "(Mana wakichisqachu)"}
                    </span>
                  </label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                    placeholder={es
                      ? "Ej: Me derivaron para segunda opinión oncológica"
                      : "Ej: Qhawachiwanku onqoyniymanta"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <Button type="button" variant="ghost" className="flex-1" onClick={cerrarModal} disabled={loading}>
                    {es ? "Cancelar" : "Saqiy"}
                  </Button>
                  <Button type="submit" className="flex-1" loading={loading}>
                    {es ? "Enviar solicitud" : "Kachay"}
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
