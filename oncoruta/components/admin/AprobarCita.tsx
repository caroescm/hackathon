"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";

interface Props {
  citaId: string;
  servicioLabel: string;
}

function hoyISO() {
  return new Date().toISOString().split("T")[0];
}

export default function AprobarCita({ citaId, servicioLabel }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [modo, setModo] = useState<"idle" | "aprobando">("idle");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function aprobar() {
    if (!fecha) { setError("Selecciona una fecha."); return; }

    setLoading(true);
    setError("");

    const { error: err } = await supabase
      .from("citas")
      .update({
        estado: "programada",
        fecha,
        hora: hora || null,
      })
      .eq("id", citaId);

    setLoading(false);

    if (err) { setError(err.message); return; }

    setModo("idle");
    router.refresh();
  }

  if (modo === "aprobando") {
    return (
      <div className="mt-3 space-y-2 border-t border-border pt-3">
        <p className="text-xs font-medium text-foreground">
          Confirmar cita — {servicioLabel}
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-muted mb-1">Fecha *</label>
            <input
              type="date"
              min={hoyISO()}
              value={fecha}
              onChange={(e) => { setFecha(e.target.value); setError(""); }}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-muted mb-1">Hora (opcional)</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex gap-2">
          <Button size="sm" loading={loading} onClick={aprobar}>
            <Check size={13} />
            Confirmar cita
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={() => { setModo("idle"); setError(""); setFecha(""); setHora(""); }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button size="sm" variant="secondary" onClick={() => setModo("aprobando")}>
      <Check size={13} />
      Aprobar solicitud
    </Button>
  );
}
