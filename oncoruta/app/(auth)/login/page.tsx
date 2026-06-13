"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales inválidas. Por favor intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-border shadow-sm p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3">
            <Heart size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">OncoRuta</h1>
          <p className="text-sm text-muted mt-1">Portal de Apoyo Oncológico</p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-1">Iniciar sesión</h2>
        <p className="text-sm text-muted mb-6">Ingresa con tu cuenta para continuar</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Ingresar
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-primary font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-muted mt-4">
        Instituto Nacional de Enfermedades Neoplásicas · INEN
      </p>
    </div>
  );
}
