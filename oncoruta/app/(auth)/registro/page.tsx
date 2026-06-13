"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { UserRole } from "@/lib/supabase/types";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "paciente" as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          role: form.role,
        },
      },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Error al crear la cuenta.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-border shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
            <Heart size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">OncoRuta</h1>
          <p className="text-sm text-muted mt-1">Crear nueva cuenta</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="fullName"
            label="Nombre completo"
            placeholder="Ana García López"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
          <Input
            id="phone"
            type="tel"
            label="Teléfono (WhatsApp)"
            placeholder="+51 999 999 999"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Tipo de usuario</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="paciente">Paciente</option>
              <option value="familiar">Familiar / Cuidador</option>
            </select>
          </div>

          <Input
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            minLength={8}
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
