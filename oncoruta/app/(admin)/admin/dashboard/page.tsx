import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Users, Calendar, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

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

type Paciente = {
  id: string;
  nombre: string;
  dni: string | null;
  created_at: string;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
  proceso_paciente: ProcesoPaciente[];
};

function esAltaPrioridad(perfil: PerfilVulnerabilidad): boolean {
  if (!perfil) return false;
  return !!(perfil.jefa_hogar || perfil.viene_provincia || perfil.tiene_discapacidad || perfil.habla_quechua);
}

function etapaActual(procesos: ProcesoPaciente[]): string | null {
  const enCurso = procesos.find((p) => p.estado === "en_curso");
  return enCurso?.pasos?.nombre ?? null;
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

  const lista = (pacientes as Paciente[] | null) ?? [];

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
      value: "—",
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

        {/* Tabla de pacientes */}
        <Card title="Pacientes" description="Lista de pacientes registrados">
          {lista.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">
              No hay pacientes registrados aún.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Paciente</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">DNI</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Etapa actual</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Prioridad</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lista.map((p) => {
                    const etapa = etapaActual(p.proceso_paciente);
                    const altaPrioridad = esAltaPrioridad(p.perfil_vulnerabilidad);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-foreground">{p.nombre}</td>
                        <td className="py-3 text-muted font-mono text-xs">{p.dni ?? "—"}</td>
                        <td className="py-3">
                          {etapa ? (
                            <Badge variant="info">{etapa}</Badge>
                          ) : (
                            <span className="text-xs text-muted">Sin etapa</span>
                          )}
                        </td>
                        <td className="py-3">
                          {altaPrioridad && (
                            <Badge variant="danger">Alta prioridad</Badge>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/paciente/${p.id}`}
                            className="text-primary text-xs font-medium hover:underline"
                          >
                            Ver expediente
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
