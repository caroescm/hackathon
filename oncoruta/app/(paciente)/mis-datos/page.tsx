import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {children}
    </p>
  );
}

function ReadonlyField({ value, icon }: { value?: string | null; icon?: React.ReactNode }) {
  return (
    <div className="h-11 border border-gray-200 rounded-lg px-3 flex items-center gap-2 bg-white">
      {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
      <span className="text-sm text-gray-800 truncate">{value || ""}</span>
    </div>
  );
}

function EditableField({
  value,
  icon,
  placeholder,
  note,
}: {
  value?: string | null;
  icon?: React.ReactNode;
  placeholder?: string;
  note?: string;
}) {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 h-11 border border-gray-200 rounded-lg px-3 flex items-center gap-2 bg-white">
          {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
          <span className="text-sm text-gray-800 truncate flex-1">
            {value || <span className="text-gray-400">{placeholder}</span>}
          </span>
        </div>
        <button
          disabled
          className="w-11 h-11 rounded-lg bg-[#3B52A2] flex items-center justify-center flex-shrink-0 opacity-80 cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default async function MisDatosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data: u } = await service
    .from("usuarios")
    .select("nombre, dni, telefono, email")
    .eq("id", user.id)
    .single();

  const nombre = u?.nombre ?? "";
  const partes = nombre.trim().split(" ");
  const nombres = partes[0] ?? "";
  const apellidoPaterno = partes[1] ?? "";
  const apellidoMaterno = partes[2] ?? "";

  return (
    <div className="p-8">
      {/* White card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#E8EAF0] flex items-center justify-center">
            <User size={20} className="text-[#3B52A2]" />
          </div>
          <h1 className="text-lg font-black uppercase tracking-widest text-gray-900">
            Datos Personales
          </h1>
        </div>

        <div className="space-y-6">
          {/* Fila 1: Tipo doc / N° doc / CI:HC */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Tipo Documento</Label>
              <ReadonlyField value="D.N.I" />
            </div>
            <div>
              <Label>N° Documento</Label>
              <ReadonlyField value={u?.dni} />
            </div>
            <div>
              <Label>CI: HC</Label>
              <ReadonlyField value="" />
            </div>
          </div>

          {/* Fila 2: Nombres / Apellido Paterno / Apellido Materno */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Nombres</Label>
              <ReadonlyField value={nombres} />
            </div>
            <div>
              <Label>Apellido Paterno</Label>
              <ReadonlyField value={apellidoPaterno} />
            </div>
            <div>
              <Label>Apellido Materno</Label>
              <ReadonlyField value={apellidoMaterno} />
            </div>
          </div>

          {/* Fila 3: Fecha Nacimiento / Celular / Email */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Fecha Nacimiento</Label>
              <ReadonlyField value="" icon={<CalendarIcon />} />
            </div>
            <div>
              <Label>Celular</Label>
              <EditableField
                value={u?.telefono}
                icon={<PhoneIcon />}
                placeholder="9 dígitos"
                note="Para editar debe enviar código de verificación"
              />
            </div>
            <div>
              <Label>Email</Label>
              <EditableField
                value={u?.email ?? user.email}
                icon={<MailIcon />}
                note="Para editar debe enviar un código de verificación."
              />
            </div>
          </div>

          {/* Fila 4: Dirección */}
          <div>
            <Label>Dirección Domicilio</Label>
            <div className="h-11 border border-gray-200 rounded-lg px-3 flex items-center gap-2 bg-white">
              <span className="text-gray-400 flex-shrink-0"><PinIcon /></span>
              <span className="text-sm text-gray-400 italic">No registrada</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">94 caracteres restantes</p>
            <button
              disabled
              className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-[#1a2f5a] text-white text-sm font-semibold rounded-lg opacity-60 cursor-not-allowed"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Guardar dirección
            </button>
          </div>

          {/* Fila 5: Geo */}
          <div className="grid grid-cols-5 gap-3">
            <div>
              <Label>Latitud</Label>
              <div className="h-10 border border-gray-200 rounded-lg px-2 flex items-center gap-1.5 bg-white">
                <span className="text-gray-400 flex-shrink-0"><PinIcon /></span>
              </div>
            </div>
            <div>
              <Label>Longitud</Label>
              <div className="h-10 border border-gray-200 rounded-lg px-2 flex items-center gap-1.5 bg-white">
                <span className="text-gray-400 flex-shrink-0"><PinIcon /></span>
              </div>
            </div>
            <div>
              <Label>Departamento</Label>
              <div className="h-10 border border-gray-200 rounded-lg px-3 bg-white" />
            </div>
            <div>
              <Label>Provincia</Label>
              <div className="h-10 border border-gray-200 rounded-lg px-3 bg-white" />
            </div>
            <div>
              <Label>Distrito</Label>
              <div className="h-10 border border-gray-200 rounded-lg px-3 bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
