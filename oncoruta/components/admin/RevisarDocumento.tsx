"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Check, X } from "lucide-react";

interface Props {
  documentoId: string;
}

export default function RevisarDocumento({ documentoId }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [modo, setModo] = useState<"idle" | "rechazando">("idle");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function aprobar() {
    setLoading(true);
    setError("");
    const { error: err } = await supabase
      .from("documentos")
      .update({ estado: "aprobado" })
      .eq("id", documentoId);
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.refresh();
  }

  async function rechazar() {
    if (!comentario.trim()) { setError("Escribe el motivo de rechazo."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase
      .from("documentos")
      .update({ estado: "rechazado", comentario: comentario.trim() })
      .eq("id", documentoId);
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.refresh();
  }

  if (modo === "rechazando") {
    return (
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <textarea
          rows={2}
          placeholder="Motivo de rechazo…"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex gap-2">
          <Button size="sm" variant="danger" loading={loading} onClick={rechazar}>
            Confirmar rechazo
          </Button>
          <Button size="sm" variant="ghost" disabled={loading} onClick={() => { setModo("idle"); setError(""); }}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button size="sm" variant="secondary" loading={loading} onClick={aprobar}>
        <Check size={13} />
        Aprobar
      </Button>
      <Button size="sm" variant="ghost" disabled={loading} onClick={() => setModo("rechazando")}>
        <X size={13} />
        Rechazar
      </Button>
    </div>
  );
}
