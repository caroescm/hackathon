import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, FileText, GitBranch, MessageCircle } from "lucide-react";

type PasoInfo = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
};

type ProcesoRow = {
  id: string;
  estado: string;
  pasos: PasoInfo | null;
};

async function getProceso(supabase: ReturnType<typeof createClient>, userId: string): Promise<ProcesoRow[]> {
  const { data } = await supabase
    .from("proceso_paciente")
    .select("id, estado, pasos (id, nombre, descripcion, orden)")
    .eq("paciente_id", userId)
    .order("orden", { referencedTable: "pasos", ascending: true });

  return (data as ProcesoRow[] | null) ?? [];
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // auth.uid() garantizado: getUser() valida el JWT con el servidor
  const userId = user.id;

  // 1. Nombre real desde tabla usuarios; fallback a user_metadata
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre")
    .eq("id", userId)
    .single();

  const nombre =
    (usuario?.nombre ?? (user.user_metadata?.nombre as string | undefined) ?? "")
      .split(" ")[0] || "Paciente";

  // 2. Proceso del paciente JOIN pasos, ordenado por pasos.orden
  let proceso = await getProceso(supabase, userId);

  // 3. Auto-crear solo si no existen registros con paso_id válido
  const tieneProcesoValido = proceso.some(p => p.pasos !== null);
  if (!tieneProcesoValido) {
    const { data: pasos, error: pasosError } = await supabase
      .from("pasos")
      .select("id, orden")
      .order("orden", { ascending: true });

    if (!pasosError && pasos && pasos.length > 0) {
      const { error: insertError } = await supabase
        .from("proceso_paciente")
        .insert(
          pasos.map((paso, i) => ({
            paciente_id: userId,
            paso_id: paso.id,
            estado: i === 0 ? "en_curso" : "pendiente",
          }))
        );

      if (!insertError) {
        proceso = await getProceso(supabase, userId);
      }
    }
  }

  const etapaActual = proceso.find((p) => p.estado === "en_curso");

  const stats = [
    {
      label: "Próxima cita",
      value: "—",
      sub: "Sin citas programadas",
      icon: <Calendar size={20} className="text-primary" />,
      color: "bg-primary-light",
    },
    {
      label: "Documentos",
      value: "0",
      sub: "archivos subidos",
      icon: <FileText size={20} className="text-success" />,
      color: "bg-green-50",
    },
    {
      label: "Etapa actual",
      value: etapaActual?.pasos?.nombre ?? "—",
      sub: "en curso",
      icon: <GitBranch size={20} className="text-warning" />,
      color: "bg-yellow-50",
    },
    {
      label: "Mensajes",
      value: "0",
      sub: "sin leer",
      icon: <MessageCircle size={20} className="text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <>
      <TopBar title={`Hola, ${nombre}`} subtitle="Aquí tienes un resumen de tu proceso" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-0">
              <div className="p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-muted font-medium">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.sub}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proceso real desde Supabase */}
          <div className="lg:col-span-2">
            <Card title="Mi Proceso de Tratamiento">
              {proceso.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">
                  No se encontraron etapas de tratamiento.
                </p>
              ) : (
                <div className="space-y-3">
                  {proceso.map((item) => {
                    const paso = item.pasos;
                    const estado = item.estado;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          estado === "completado" ? "bg-success" :
                          estado === "en_curso"   ? "bg-primary" : "bg-gray-200"
                        }`} />
                        <div className="flex-1 flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            estado === "pendiente" ? "text-muted" : "text-foreground"
                          }`}>
                            {paso?.nombre ?? "—"}
                          </span>
                          <Badge variant={
                            estado === "completado" ? "success" :
                            estado === "en_curso"   ? "info"    : "default"
                          }>
                            {estado === "completado" ? "Completado" :
                             estado === "en_curso"   ? "En curso"  : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Próximas citas — placeholder hasta tener tabla citas */}
          <Card title="Próximas Citas">
            <p className="text-sm text-muted text-center py-4">
              No tienes citas programadas.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
