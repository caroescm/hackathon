export type UserRole = "paciente" | "admin";

// ─── Auth / Profiles ─────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

// ─── Tabla: usuarios ─────────────────────────────────────────────────────────

export interface Usuario {
  id: string;
  dni: string;
  nombre: string;
  telefono?: string;
  email?: string;
  rol: UserRole;
  idioma: "es" | "qu";
  created_at: string;
}

// ─── Tabla: perfil_vulnerabilidad ────────────────────────────────────────────

export interface PerfilVulnerabilidad {
  id: string;
  paciente_id: string;
  jefa_hogar: boolean;
  de_provincia: boolean;
  tiene_discapacidad: boolean;
  habla_quechua: boolean;
  created_at: string;
}

// ─── Tabla: proceso_paciente ─────────────────────────────────────────────────

export type EstadoEtapa = "pendiente" | "en_curso" | "completado";

export interface ProcesoPaciente {
  id: string;
  paciente_id: string;
  etapa: EtapaProceso;
  estado: EstadoEtapa;
  orden: number;
  created_at: string;
}

// ─── Tipos médicos ────────────────────────────────────────────────────────────

export type EtapaProceso =
  | "diagnostico"
  | "cirugia"
  | "quimioterapia"
  | "radioterapia"
  | "hormonoterapia"
  | "seguimiento";

export interface Paciente {
  id: string;
  profile_id: string;
  numero_historia: string;
  fecha_diagnostico?: string;
  tipo_cancer?: string;
  estadio?: string;
  etapa_actual: EtapaProceso;
  familiar_id?: string;
}

export interface Cita {
  id: string;
  paciente_id: string;
  tipo: string;
  fecha: string;
  hora: string;
  lugar: string;
  medico?: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  notas?: string;
}

export interface Documento {
  id: string;
  paciente_id: string;
  nombre: string;
  tipo: string;
  url: string;
  fecha_subida: string;
  subido_por: string;
}
