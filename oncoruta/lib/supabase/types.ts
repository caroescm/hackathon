export type UserRole = "paciente" | "familiar" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

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

export type EtapaProceso =
  | "diagnostico"
  | "cirugia"
  | "quimioterapia"
  | "radioterapia"
  | "hormonoterapia"
  | "seguimiento";

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
