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

/* ── Floating-label input ── */
function FloatingInput({
  id, label, type = "text", value, onChange, suffix, error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full border rounded-sm px-3 pt-5 pb-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a56db] focus:border-transparent bg-white ${
          suffix ? "pr-11" : ""
        } ${error ? "border-red-400" : "border-gray-400"}`}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500 pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-[11px] peer-focus:text-[#1a56db] transition-all duration-150"
      >
        {label}
      </label>
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── reCAPTCHA visual placeholder ── */
function RecaptchaPlaceholder() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="border border-gray-300 rounded-sm bg-[#f9f9f9] flex items-center justify-between px-4 py-3 w-full max-w-[300px]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked((v) => !v)}
          className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
            checked ? "bg-[#1a56db] border-[#1a56db]" : "bg-white border-gray-400"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 12 10" width="12" height="10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <span className="text-sm text-gray-700 select-none">No soy un robot</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 ml-4">
        {/* reCAPTCHA logo */}
        <svg viewBox="0 0 64 64" width="38" height="38">
          <circle cx="32" cy="32" r="30" fill="#4A90D9" />
          <path d="M32 12 C20 12 12 20 12 32 C12 44 20 52 32 52 C44 52 52 44 52 32" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M32 12 L38 20 L32 18 L26 20 Z" fill="white" />
        </svg>
        <p className="text-[9px] text-gray-500 font-semibold leading-none">reCAPTCHA</p>
        <p className="text-[8px] text-gray-400 leading-none">Privacidad · Términos</p>
      </div>
    </div>
  );
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
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/inen-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenedor principal flotante */}
      <div className="relative z-10 flex w-full max-w-[980px] mx-4 shadow-2xl" style={{ minHeight: 620 }}>

        {/* ══ PANEL IZQUIERDO — blanco ══ */}
        <div className="flex-1 bg-white flex flex-col items-center justify-start px-10 py-10">

          {/* Logo combinado MINSA + INEN */}
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logos/minsa_inen.png"
              alt="PERÚ Ministerio de Salud - INEN"
              width={260}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          {/* Título */}
          <h1 className="text-[19px] font-black text-gray-900 uppercase tracking-wide text-center mb-1 whitespace-nowrap">
            Portal de Atención al Paciente
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">Ingrese su cuenta</p>

          <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">

            {/* DNI selector + Nº Documento en la misma fila */}
            <div className="flex gap-3 items-start">
              {/* Select tipo documento */}
              <div className="relative flex-shrink-0 w-[120px]">
                <select className="w-full h-[48px] border border-gray-400 rounded-sm px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56db] appearance-none pr-8">
                  <option value="DNI">DNI</option>
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Nº Documento con floating label */}
              <div className="flex-1">
                <FloatingInput
                  id="dni"
                  label="N° Documento"
                  value={dni}
                  onChange={(v) => {
                    setDni(v.replace(/\D/g, "").slice(0, 8));
                    if (errors.dni) setErrors((p) => ({ ...p, dni: undefined }));
                  }}
                  error={errors.dni}
                />
              </div>
            </div>

            {/* Contraseña con floating label */}
            <FloatingInput
              id="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(v) => {
                setPassword(v);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((x) => !x)}
                  className="text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              error={errors.password}
            />

            {/* Olvidó contraseña */}
            <Link href="#" className="block text-sm text-[#1a56db] hover:underline">
              Olvidó su contraseña?
            </Link>

            {/* reCAPTCHA visual */}
            <RecaptchaPlaceholder />

            {/* Error general */}
            {errors.general && (
              <div className="p-3 rounded-sm bg-red-50 border border-red-200 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Botón INICIAR SESIÓN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold py-3 rounded-sm text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span>&#8594;</span>
              )}
              Iniciar Sesión
            </button>

            {/* Separador -o- */}
            <p className="text-center text-sm text-gray-400 my-1">-o-</p>

            {/* Botón ID PERU */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full border-2 border-green-600 text-green-700 bg-white font-bold py-3 rounded-sm text-sm tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* ID icon */}
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

            {/* Divisor */}
            <div className="border-t border-gray-200 my-2" />

            {/* Crear cuenta */}
            <p className="text-center text-sm text-gray-600">
              No tiene cuenta?{" "}
              <Link
                href="/registro"
                className="border border-[#e02424] text-[#e02424] text-xs font-bold px-3 py-1 rounded-sm hover:bg-red-50 transition-colors uppercase tracking-wide"
              >
                Crear Cuenta
              </Link>
            </p>
          </form>
        </div>

        {/* ══ PANEL DERECHO — azul ══ */}
        <div className="flex-1 bg-[#3B52A2] flex flex-col justify-center px-12 py-12 text-white">
          <h2 className="text-2xl font-bold mb-4">Atención al Paciente</h2>
          <p className="text-sm text-blue-200 leading-relaxed mb-10">
            Dirigido a los pacientes que deseen obtener los resultados de los exámenes realizados en
            el INEN, de forma virtual y sin necesidad de acudir a la institución.
          </p>

          {/* Botones de recursos */}
          <div className="space-y-3 mb-12">
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full bg-[#D8E4F2] text-[#2B3F7A] font-bold py-3 px-6 rounded-sm text-xs tracking-widest uppercase disabled:cursor-not-allowed"
              >
                Ver Video Tutorial
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-800 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Próximamente
              </div>
            </div>
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full bg-[#D8E4F2] text-[#2B3F7A] font-bold py-3 px-6 rounded-sm text-xs tracking-widest uppercase disabled:cursor-not-allowed"
              >
                Manual de Usuario
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-800 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Próximamente
              </div>
            </div>
          </div>

          {/* Soporte */}
          <p className="text-sm text-blue-200 text-center leading-relaxed">
            Para consultas con el portal o soporte técnico, comuníquese al (511) 201-6500 Anexo 1051.
          </p>
        </div>
      </div>
    </div>
  );
}
