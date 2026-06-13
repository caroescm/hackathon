import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import TablaPacientes, { type PacienteRow } from "./TablaPacientes";
import { Users, Calendar, FileText, AlertCircle } from "lucide-react";

type PerfilVulnerabilidad = {
  jefa_hogar: boolean | null;
  viene_provincia: boolean | null;
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
  created_at: string;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
  proceso_paciente: ProcesoPaciente[];
};

function esInactivo(p: PacienteRaw): boolean {
  const creado = new Date(p.created_at);
  const diasDesdeRegistro = (Date.now() - creado.getTime()) / (1000 * 60 * 60 * 24);
  if (diasDesdeRegistro <= 7) return false;

  const primerPaso = p.proceso_paciente.find(
    (pp) => pp.pasos?.orden === 1 && pp.estado === "en_curso"
  );
  return !!primerPaso;
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: totalPacientes },
    { count: docsPendientes },
    { data: pacientes },
  ] = await Promise.all([
    supabase
      .from("usuarios")
      .select("id", { count: "exact", head: true })
      .eq("rol", "paciente"),
    supabase
      .from("documentos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "enviado"),
    supabase
      .from("usuarios")
      .select(`
        id, nombre, dni, created_at,
        perfil_vulnerabilidad(jefa_hogar, viene_provincia, tiene_discapacidad, habla_quechua),
        proceso_paciente(estado, pasos(nombre, orden))
      `)
      .eq("rol", "paciente")
      .order("created_at", { ascending: false }),
  ]);

  const listaRaw = (pacientes as PacienteRaw[] | null) ?? [];

  const lista: PacienteRow[] = listaRaw.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    dni: p.dni,
    perfil_vulnerabilidad: p.perfil_vulnerabilidad,
    proceso_paciente: p.proceso_paciente,
    inactivo: esInactivo(p),
  }));

  const totalAlertas = lista.filter((p) => p.inactivo).length;

  const stats = [
    {
      label: "Pacientes activos",
      value: totalPacientes?.toString() ?? "—",
      icon: <Users size={20} className="text-primary" />,
      color: "bg-primary-light",
    },
    {
      label: "Citas hoy",
      value: "—",
      icon: <Calendar size={20} className="text-success" />,
      color: "bg-green-50",
    },
    {
      label: "Documentos pendientes",
      value: docsPendientes?.toString() ?? "—",
      icon: <FileText size={20} className="text-warning" />,
      color: "bg-yellow-50",
    },
    {
      label: "Alertas",
      value: totalAlertas > 0 ? totalAlertas.toString() : "0",
      icon: <AlertCircle size={20} className="text-danger" />,
      color: "bg-red-50",
    },
  ];

  return (
    <>
      <TopBar title="Panel Administrativo" subtitle="Gestión de pacientes OncoRuta" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-0">
              <div className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabla con filtros */}
        <Card title="Pacientes" description="Lista de pacientes registrados">
          {lista.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">
              No hay pacientes registrados aún.
            </p>
          ) : (
            <TablaPacientes pacientes={lista} />
          )}
        </Card>
      </div>
    </>
  );
}
