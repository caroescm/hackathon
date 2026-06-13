"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface Props {
  pacienteId: string;
}

export default function AgregarNota({ pacienteId }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contenido.trim()) { setError("Escribe el contenido de la nota."); return; }

    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase.from("notas_internas").insert({
      paciente_id: pacienteId,
      admin_id: user?.id,
      contenido: contenido.trim(),
    });

    setLoading(false);

    if (dbError) { setError(dbError.message); return; }

    setContenido("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={3}
        placeholder="Escribe una nota interna sobre esta paciente…"
        value={contenido}
        onChange={(e) => { setContenido(e.target.value); setError(""); }}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      />
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={loading}>
          Agregar nota
        </Button>
      </div>
    </form>
  );
}
