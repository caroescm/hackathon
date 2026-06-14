"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getRolAction } from "@/app/actions/auth";
import type { UserRole } from "@/lib/supabase/types";

function dashboardForRole(role: UserRole): string {
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}

interface FieldErrors {
  dni?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validateFields(): boolean {
    const next: FieldErrors = {};
    if (!dni.trim()) next.dni = "Ingrese su número de documento";
    else if (!/^\d{8}$/.test(dni)) next.dni = "El DNI debe tener exactamente 8 dígitos";
    if (!password) next.password = "Ingrese su contraseña";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    const email = `${dni}@inen.gob.pe`;
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const { data: usuarioExiste } = await supabase
        .from("usuarios")
        .select("id")
        .eq("dni", dni)
        .maybeSingle();

      if (!usuarioExiste) {
        setErrors({ dni: "DNI no registrado en el sistema" });
      } else {
        setErrors({ password: "Contraseña incorrecta" });
      }
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) { setLoading(false); return; }

    const rol = await getRolAction(userId);
    router.push(dashboardForRole(rol as UserRole));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Logo + app name */}
        <div className="text-center mb-8">
          <Image
            src="/logos/minsa_inen.png"
            alt="PERÚ Ministerio de Salud - INEN"
            width={220}
            height={42}
            priority
            className="object-contain mx-auto mb-5"
          />
          <h1 className="text-2xl font-bold text-[#1a56db]">OncoRuta</h1>
          <p className="text-sm text-gray-400 mt-0.5">INEN · Mujer</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              DNI
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="8 dígitos"
              maxLength={8}
              value={dni}
              onChange={(e) => {
                setDni(e.target.value.replace(/\D/g, "").slice(0, 8));
                if (errors.dni) setErrors((p) => ({ ...p, dni: undefined }));
              }}
              className={`w-full h-12 border rounded-xl px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.dni ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.dni && <p className="mt-1 text-xs text-red-500">{errors.dni}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`w-full h-12 border rounded-xl px-4 pr-12 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1a56db] hover:bg-[#1648c4] disabled:opacity-60 text-white font-semibold rounded-xl text-sm tracking-wide transition-colors flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </>
            ) : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-[#1a56db] font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </form>

        {/* ID Peru — próximamente */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="relative group">
            <button
              type="button"
              disabled
              className="w-full h-12 border-2 border-green-600 text-green-700 bg-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <path d="M14 10h4M14 14h4" strokeLinecap="round" />
              </svg>
              Iniciar con ID Perú
            </button>
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Próximamente
            </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-4 text-xs text-gray-400">
        Instituto Nacional de Enfermedades Neoplásicas · (01) 201-6000
      </p>
    </div>
  );
}
