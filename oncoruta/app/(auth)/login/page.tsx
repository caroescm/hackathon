"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, PlayCircle, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getRolAction } from "@/app/actions/auth";
import LogoHeader from "@/components/ui/LogoHeader";
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
      // Verificar si el DNI existe para dar un error específico
      // Requiere política RLS: anon puede SELECT id FROM usuarios WHERE dni = ?
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

    // Server action con service role — bypasa la política RLS de authenticated
    const rol = await getRolAction(userId);
    router.push(dashboardForRole(rol as UserRole));
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* ── Columna izquierda: Formulario ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-16 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logos oficiales */}
          <LogoHeader className="mb-8" />

          {/* Títulos */}
          <div className="text-center mb-7">
            <h1 className="text-lg font-bold text-gray-800 tracking-wide uppercase">
              Portal de Atención al Paciente
            </h1>
            <p className="text-sm text-gray-500 mt-1">Ingrese su cuenta</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Tipo documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                <option value="DNI">DNI - Documento Nacional de Identidad</option>
              </select>
            </div>

            {/* N° Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nº Documento
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ingrese sus 8 dígitos"
                maxLength={8}
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.replace(/\D/g, ""));
                  if (errors.dni) setErrors((p) => ({ ...p, dni: undefined }));
                }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.dni ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.dni && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                  {errors.dni}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Olvidé contraseña */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-xs text-primary hover:underline"
              >
                ¿Olvidó su contraseña?
              </Link>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Botón principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Iniciar Sesión
            </button>

            {/* Separador */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">- O -</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* ID PERU button (deshabilitado) */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full border-2 border-green-600 text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 rounded-lg text-sm tracking-widest uppercase"
              >
                Iniciar con ID Perú
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Próximamente
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
              </div>
            </div>

            {/* Link registro */}
            <p className="text-center text-sm text-gray-500 pt-1">
              ¿No tiene cuenta?{" "}
              <Link href="/registro" className="text-primary font-semibold hover:underline">
                Crear Cuenta
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ── Columna derecha: Información ── */}
      <div className="hidden lg:flex w-[420px] xl:w-[480px] bg-primary flex-col items-center justify-center px-12 py-16 text-white">
        <div className="max-w-xs text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-3">Atención al Paciente</h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Dirigido a los pacientes que deseen obtener los resultados de los exámenes
              realizados en el INEN, de forma virtual y sin necesidad de acudir a la institución.
            </p>
          </div>

          <div className="space-y-3 w-full">
            {/* Video tutorial (deshabilitado) */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full border border-white text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
              >
                <PlayCircle size={17} />
                Ver Video Tutorial
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                Próximamente
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
              </div>
            </div>

            {/* Manual (deshabilitado) */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full border border-white text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide uppercase flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
              >
                <BookOpen size={17} />
                Manual de Usuario
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                Próximamente
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
              </div>
            </div>
          </div>

          {/* Soporte técnico */}
          <div className="pt-4 border-t border-blue-400 text-center">
            <Phone size={14} className="mx-auto mb-1.5 text-blue-200" />
            <p className="text-xs text-blue-100 leading-relaxed">
              Para consultas con el portal o soporte técnico, comuníquese al
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              (511) 201-6500 Anexo 1051
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
