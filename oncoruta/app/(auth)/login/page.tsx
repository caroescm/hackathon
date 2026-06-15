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
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: "url('/inen-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#1a2340]/70" />
      <div className="flex w-full max-w-5xl shadow-2xl overflow-hidden" style={{ minHeight: 600 }}>

        {/* ── Panel izquierdo — formulario ── */}
        <div className="w-1/2 bg-white px-14 py-10 flex flex-col">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logos/minsa_inen.png"
              alt="PERÚ Ministerio de Salud - INEN"
              width={220}
              height={42}
              priority
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-xl font-black text-center text-gray-900 uppercase tracking-tight mb-1">
            Portal de Atención al Paciente
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">Ingrese su cuenta</p>

          {errors.general && (
            <div className="mb-3 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4 flex-1">

            {/* Fila: DNI tipo + N° Documento */}
            <div className="flex gap-2 items-stretch">
              <div className="w-28 border border-gray-300 rounded px-3 h-12 flex items-center justify-between text-sm text-gray-700 flex-shrink-0 select-none">
                <span>DNI</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => {
                    setDni(e.target.value.replace(/\D/g, "").slice(0, 8));
                    if (errors.dni) setErrors((p) => ({ ...p, dni: undefined }));
                  }}
                  className={`w-full h-12 border rounded px-3 pt-4 pb-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.dni ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
                <label className="absolute left-3 top-1.5 text-[10px] text-gray-500 pointer-events-none">
                  N° Documento
                </label>
              </div>
            </div>
            {errors.dni && <p className="!mt-1 text-xs text-red-500">{errors.dni}</p>}

            {/* Contraseña */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`w-full h-12 border rounded px-3 pt-4 pb-1 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              <label className="absolute left-3 top-1.5 text-[10px] text-gray-500 pointer-events-none">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="!mt-1 text-xs text-red-500">{errors.password}</p>}

            {/* Olvidó contraseña */}
            <div>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Olvidó su contraseña?
              </button>
            </div>

            {/* Iniciar sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1a56db] hover:bg-[#1648c4] disabled:opacity-60 text-white font-bold rounded text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  INICIAR SESIÓN
                </>
              )}
            </button>

            {/* -O- */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">-O-</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ID Perú */}
            <button
              type="button"
              disabled
              className="w-full h-12 border-2 border-green-600 text-green-700 font-bold rounded text-sm uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <path d="M14 10h4M14 14h4" strokeLinecap="round" />
              </svg>
              INICIAR CON ID PERU
            </button>

            {/* Crear cuenta */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-center gap-3">
              <span className="text-sm text-gray-500">No tiene cuenta?</span>
              <Link
                href="/registro"
                className="px-4 py-1.5 border-2 border-red-400 text-red-500 text-sm font-bold rounded hover:bg-red-50 transition-colors uppercase"
              >
                CREAR CUENTA
              </Link>
            </div>

          </form>
        </div>

        {/* ── Panel derecho — información azul ── */}
        <div className="w-1/2 bg-[#1a56db] px-12 py-10 flex flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl font-bold mb-4 leading-snug">
              Atención al Paciente
            </h2>
            <p className="text-sm leading-relaxed text-white/90 mb-8">
              Dirigido a los pacientes que deseen obtener los resultados de los exámenes realizados en el INEN, de forma virtual y sin necesidad de acudir a la institución.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full py-3 border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold uppercase tracking-wide transition-colors"
              >
                VER VIDEO TUTORIAL
              </button>
              <button
                type="button"
                className="w-full py-3 border border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold uppercase tracking-wide transition-colors"
              >
                MANUAL DE USUARIO
              </button>
            </div>
          </div>

          <p className="text-xs text-white/60 text-center leading-relaxed mt-8">
            Para consultas con el portal o soporte técnico, comuníquese al (01) 201-6000 Anexo 1051.
          </p>
        </div>

      </div>
    </div>
  );
}
