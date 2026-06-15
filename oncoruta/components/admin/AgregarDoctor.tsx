"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserPlus, X } from "lucide-react";

export default function AgregarDoctor() {
  const supabase = createClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    especialidad: "",
    email: "",
    telefono: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.especialidad.trim()) {
      setError("Nombre y especialidad son obligatorios.");
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase.from("doctores").insert({
      nombre: form.nombre.trim(),
      especialidad: form.especialidad.trim(),
      email: form.email.trim() || null,
      telefono: form.telefono.trim() || null,
      activo: true,
    });
    setLoading(false);

    if (dbError) { setError(dbError.message); return; }

    setForm({ nombre: "", especialidad: "", email: "", telefono: "" });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <UserPlus size={15} />
        Agregar doctor
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Nuevo doctor</h3>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(""); }}
          className="p-1 rounded text-muted hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="nombre"
            name="nombre"
            label="Nombre completo"
            placeholder="Dr. García"
            value={form.nombre}
            onChange={handleChange}
          />
          <Input
            id="especialidad"
            name="especialidad"
            label="Especialidad"
            placeholder="Oncología Médica"
            value={form.especialidad}
            onChange={handleChange}
          />
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="dr@inen.gob.pe"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            id="telefono"
            name="telefono"
            label="Teléfono"
            placeholder="(01) 201-6000"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="text-xs text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => { setOpen(false); setError(""); }}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" loading={loading}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
