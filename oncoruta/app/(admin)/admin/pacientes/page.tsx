import { createServiceClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import TablaPacientes, { type PacienteRow } from "@/app/(admin)/admin/dashboard/TablaPacientes";

type PerfilVulnerabilidad = {
  jefa_hogar: boolean | null;
  de_provincia: boolean | null;
  tiene_discapacidad: boolean | null;
  habla_quechua: boolean | null;
} | null;

type ProcesoPaciente = {
  estado: string;
  pasos: { nombre: string; orden: number } | null;
};

type PacienteRaw = {
  id: string;
  nombre: string;
  dni: string | null;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
  proceso_paciente: ProcesoPaciente[];
};

export default async function PacientesPage() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("usuarios")
    .select(`
      id, nombre, dni,
      perfil_vulnerabilidad(jefa_hogar, de_provincia, tiene_discapacidad, habla_quechua),
      proceso_paciente(estado, pasos(nombre, orden))
    `)
    .eq("rol", "paciente");

  const raw = (data as PacienteRaw[] | null) ?? [];

  const pacientes: PacienteRow[] = raw.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    dni: p.dni,
    perfil_vulnerabilidad: p.perfil_vulnerabilidad,
    proceso_paciente: p.proceso_paciente,
    inactivo: false,
  }));

  return (
    <>
      <TopBar
        title="Pacientes"
        subtitle={`${pacientes.length} paciente${pacientes.length !== 1 ? "s" : ""} registrado${pacientes.length !== 1 ? "s" : ""}`}
      />

      <div className="p-6">
        <Card>
          {pacientes.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No hay pacientes registrados aún.</p>
          ) : (
            <TablaPacientes pacientes={pacientes} />
          )}
        </Card>
      </div>
    </>
  );
}
