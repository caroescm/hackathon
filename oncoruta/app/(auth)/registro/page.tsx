"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Shield, Search, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LogoHeader from "@/components/ui/LogoHeader";

interface FormState {
  nombreCompleto: string;
  dni: string;
  telefono: string;
  email: string;
  password: string;
}

interface VulnerabilidadState {
  jefaHogar: boolean;
  vieneProvincia: boolean;
  tieneDiscapacidad: boolean;
  hablaQuechua: boolean;
}

type TipoPaciente = "preventivo" | "sospecha" | "diagnosticado";

interface FieldErrors {
  nombreCompleto?: string;
  dni?: string;
  telefono?: string;
  password?: string;
  tipoPaciente?: string;
  general?: string;
}


export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({
    nombreCompleto: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [vulnerabilidad, setVulnerabilidad] = useState<VulnerabilidadState>({
    jefaHogar: false,
    vieneProvincia: false,
    tieneDiscapacidad: false,
    hablaQuechua: false,
  });
  const [tipoPaciente, setTipoPaciente] = useState<TipoPaciente | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateForm(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function toggleVulnerabilidad(key: keyof VulnerabilidadState) {
    setVulnerabilidad((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function validateFields(): boolean {
    const next: FieldErrors = {};

    if (!form.nombreCompleto.trim()) {
      next.nombreCompleto = "El nombre completo es requerido";
    }
    if (!form.dni.trim()) {
      next.dni = "El DNI es requerido";
    } else if (!/^\d{8}$/.test(form.dni)) {
      next.dni = "El DNI debe tener exactamente 8 dígitos numéricos";
    }
    if (!form.telefono.trim()) {
      next.telefono = "El teléfono/celular es requerido";
    } else if (!/^\d{9}$/.test(form.telefono)) {
      next.telefono = "El celular debe tener 9 dígitos";
    }
    if (!form.password) {
      next.password = "La contraseña es requerida";
    } else if (form.password.length < 8) {
      next.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!tipoPaciente) {
      next.tipoPaciente = "Selecciona tu situación actual para continuar";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setErrors({});

    const email = `${form.dni}@inen.gob.pe`;

    // 1. Crear usuario en Supabase Auth
    // Nota: en Supabase → Authentication → Settings → desactivar "Confirm email"
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        // Guarda nombre en user_metadata como fallback para el sidebar
        // en caso de que la query a usuarios falle por RLS
        data: { nombre: form.nombreCompleto.trim() },
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setErrors({ dni: "Este DNI ya tiene una cuenta. Inicia sesión." });
      } else {
        setErrors({ general: `Error al crear la cuenta: ${signUpError.message}` });
      }
      setLoading(false);
      return;
    }

    const user = authData.user;
    if (!user) {
      setErrors({ general: "No se pudo crear el usuario. Intente nuevamente." });
      setLoading(false);
      return;
    }

    // 2. Insertar en tabla usuarios
    const { error: usuarioError } = await supabase.from("usuarios").insert({
      id: user.id,
      dni: form.dni,
      nombre: form.nombreCompleto.trim(),
      telefono: form.telefono,
      email: form.email.trim() || null,
      rol: "paciente",
      idioma: vulnerabilidad.hablaQuechua ? "qu" : "es",
      tipo_paciente: tipoPaciente,
    });

    if (usuarioError) {
      if (usuarioError.code === "23505") {
        setErrors({ dni: "Este DNI ya tiene una cuenta. Inicia sesión." });
      } else {
        setErrors({ general: `Error al guardar datos: ${usuarioError.message}` });
      }
      setLoading(false);
      return;
    }

    // 3. Insertar perfil de vulnerabilidad
    const { error: vulnError } = await supabase.from("perfil_vulnerabilidad").insert({
      paciente_id: user.id,
      jefa_hogar: vulnerabilidad.jefaHogar,
      de_provincia: vulnerabilidad.vieneProvincia,
      tiene_discapacidad: vulnerabilidad.tieneDiscapacidad,
      habla_quechua: vulnerabilidad.hablaQuechua,
    });

    if (vulnError) {
      setErrors({ general: `Error al guardar perfil de vulnerabilidad: ${vulnError.message}` });
      setLoading(false);
      return;
    }

    // 4. Intentar crear proceso desde pasos DB (no bloquea — proceso usa fallback hardcoded)
    const { data: pasos } = await supabase
      .from("pasos")
      .select("id")
      .order("orden", { ascending: true });

    if (pasos && pasos.length > 0) {
      await supabase.from("proceso_paciente").insert(
        pasos.map((paso, i) => ({
          paciente_id: user.id,
          paso_id: paso.id,
          estado: i === 0 ? "en_curso" : "pendiente",
        }))
      );
    }

    router.push("/dashboard");
  }

  // ─── Opciones de vulnerabilidad ────────────────────────────────────────────

  const opcionesVulnerabilidad = [
    { key: "jefaHogar" as const, icon: "👤", label: "Jefa de hogar" },
    { key: "vieneProvincia" as const, icon: "📍", label: "Vengo de provincia" },
    { key: "tieneDiscapacidad" as const, icon: "♿", label: "Tengo discapacidad" },
    { key: "hablaQuechua" as const, icon: "🗣️", label: "Hablo quechua" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header con logos */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <LogoHeader className="mb-6" size="sm" />
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-800">Crear cuenta de paciente</h1>
              <p className="text-sm text-gray-500 mt-1">
                Complete sus datos para acceder a sus citas y resultados médicos
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-4">

            {/* Error general */}
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Ana García López"
                value={form.nombreCompleto}
                onChange={(e) => updateForm("nombreCompleto", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.nombreCompleto ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.nombreCompleto && (
                <p className="mt-1 text-xs text-red-500">{errors.nombreCompleto}</p>
              )}
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="8 dígitos"
                maxLength={8}
                value={form.dni}
                onChange={(e) => updateForm("dni", e.target.value.replace(/\D/g, ""))}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.dni ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.dni && (
                <p className="mt-1 text-xs text-red-500">{errors.dni}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono / Celular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="9 dígitos (WhatsApp)"
                maxLength={9}
                value={form.telefono}
                onChange={(e) => updateForm("telefono", e.target.value.replace(/\D/g, ""))}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.telefono ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.telefono && (
                <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>
              )}
            </div>

            {/* Email (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico{" "}
                <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 pr-11 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
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
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* ── Tipo de paciente ── */}
            <div className="mt-2 pt-5 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                ¿Cuál es tu situación? <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Esto nos ayuda a mostrarte el proceso adecuado para tu caso.
              </p>
              <div className="flex flex-col gap-3">
                {([
                  { value: "preventivo" as const, Icon: Shield, label: "Vengo a un chequeo preventivo" },
                  { value: "sospecha" as const, Icon: Search, label: "Tengo sospecha de cáncer" },
                  { value: "diagnosticado" as const, Icon: FileText, label: "Ya tengo un diagnóstico" },
                ] as const).map(({ value, Icon, label }) => {
                  const selected = tipoPaciente === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setTipoPaciente(value);
                        setErrors((prev) => ({ ...prev, tipoPaciente: undefined }));
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all duration-150 ${
                        selected
                          ? "border-primary bg-primary-light text-primary"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.tipoPaciente && (
                <p className="mt-2 text-xs text-red-500">{errors.tipoPaciente}</p>
              )}
            </div>

            {/* ── Perfil de Vulnerabilidad ── */}
            <div className="mt-2 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-primary" />
                <h3 className="text-sm font-semibold text-gray-800">
                  Perfil de Vulnerabilidad
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Marque las opciones que apliquen a su situación actual para brindarle
                una atención prioritaria si lo requiere.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {opcionesVulnerabilidad.map(({ key, icon, label }) => {
                  const selected = vulnerabilidad[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleVulnerabilidad(key)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all duration-150 ${
                        selected
                          ? "border-primary bg-primary-light text-primary"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base leading-none">{icon}</span>
                      <span className="leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón registrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-3 rounded-lg text-sm uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>Registrarme →</>
                )}
              </button>
            </div>

            {/* Texto legal */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Al registrarte, aceptas nuestros{" "}
              <span className="text-primary cursor-pointer hover:underline">Términos y Condiciones</span>
              {" "}y la{" "}
              <span className="text-primary cursor-pointer hover:underline">Política de Privacidad de Datos</span>.
            </p>

            {/* Link a login */}
            <p className="text-center text-sm text-gray-500">
              ¿Ya tiene una cuenta?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>

        {/* Footer institucional */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Instituto Nacional de Enfermedades Neoplásicas · INEN ·{" "}
          <span className="font-medium">Portal de Atención al Paciente</span>
        </p>
      </div>
    </div>
  );
}
