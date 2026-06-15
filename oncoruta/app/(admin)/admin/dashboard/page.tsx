import { createServiceClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getPrioridad } from "@/lib/utils/prioridad";
import { Users, Calendar, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

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

type Paciente = {
  id: string;
  nombre: string;
  dni: string | null;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
  proceso_paciente: ProcesoPaciente[];
};

type Doctor = {
  id: string;
  nombre: string;
  especialidad: string | null;
  activo: boolean | null;
};

const PRIORIDAD_BADGE = {
  ALTA:  { variant: "danger"  as const, label: "Alta" },
  MEDIA: { variant: "warning" as const, label: "Media" },
} as const;

function etapaActual(procesos: ProcesoPaciente[]): string | null {
  return procesos.find((p) => p.estado === "en_curso")?.pasos?.nombre ?? null;
}

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const hoy = new Date().toISOString().split("T")[0];
  const haceSeteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalPacientes },
    { count: docsPendientes },
    { count: citasHoy },
    { count: alertas },
    { data: pacientesData },
    { data: doctoresData },
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
      .from("citas")
      .select("id", { count: "exact", head: true })
      .eq("fecha", hoy),
    supabase
      .from("proceso_paciente")
      .select("id", { count: "exact", head: true })
      .neq("estado", "completado")
      .lt("created_at", haceSeteDias),
    supabase
      .from("usuarios")
      .select(`
        id, nombre, dni,
        perfil_vulnerabilidad(jefa_hogar, de_provincia, tiene_discapacidad, habla_quechua),
        proceso_paciente(estado, pasos(nombre, orden))
      `)
      .eq("rol", "paciente")
      .limit(4),
    supabase
      .from("doctores")
      .select("id, nombre, especialidad, activo")
      .eq("activo", true)
      .limit(4),
  ]);

  const pacientes = (pacientesData as Paciente[] | null) ?? [];
  const doctores = (doctoresData as Doctor[] | null) ?? [];

  const stats = [
    {
      label: "Pacientes activos",
      value: totalPacientes?.toString() ?? "—",
      icon: <Users size={20} className="text-primary" />,
      color: "bg-primary-light",
    },
    {
      label: "Citas hoy",
      value: citasHoy?.toString() ?? "—",
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
      value: alertas?.toString() ?? "0",
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

        {/* Dos columnas: pacientes recientes + doctores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pacientes recientes */}
          <Card title="Pacientes recientes">
            {pacientes.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">No hay pacientes registrados.</p>
            ) : (
              <div className="space-y-0">
                {pacientes.map((p) => {
                  const etapa = etapaActual(p.proceso_paciente);
                  const prioridad = getPrioridad(p.perfil_vulnerabilidad);
                  const badgePrioridad = prioridad !== "BAJA" ? PRIORIDAD_BADGE[prioridad] : null;
                  return (
                    <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                          {badgePrioridad && (
                            <Badge variant={badgePrioridad.variant}>{badgePrioridad.label}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted">{etapa ?? "Sin etapa"}</p>
                      </div>
                      <Link
                        href={`/admin/paciente/${p.id}`}
                        className="text-primary text-xs font-medium hover:underline flex-shrink-0 ml-3"
                      >
                        Ver
                      </Link>
                    </div>
                  );
                })}
                <div className="pt-3">
                  <Link href="/admin/pacientes" className="text-xs text-primary font-medium hover:underline">
                    Ver todos los pacientes →
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* Doctores */}
          <Card title="Doctores">
            {doctores.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted text-center py-4">No hay doctores registrados.</p>
                <Link href="/admin/doctores" className="text-xs text-primary font-medium hover:underline">
                  Ir a doctores →
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {doctores.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.nombre}</p>
                      <p className="text-xs text-muted">{d.especialidad ?? "—"}</p>
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>
                ))}
                <div className="pt-3">
                  <Link href="/admin/doctores" className="text-xs text-primary font-medium hover:underline">
                    Ver todos los doctores →
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
