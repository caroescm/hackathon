import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Lock, Calendar, Search, GitBranch, FileText, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

/* ─── tipos ──────────────────────────────────────────── */

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

/* ─── helpers ────────────────────────────────────────── */

async function getProceso(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<ProcesoRow[]> {
  const { data } = await supabase
    .from("proceso_paciente")
    .select("id, estado, pasos (id, nombre, descripcion, orden)")
    .eq("paciente_id", userId)
    .order("orden", { referencedTable: "pasos", ascending: true });
  return (data as ProcesoRow[] | null) ?? [];
}

/* ─── tarjetas de acción (top) ───────────────────────── */

const ACTION_CARDS = [
  {
    icon: Lock,
    iconBg: "#E8EAF0",
    iconColor: "#3B52A2",
    title: "CONSULTA TUS RESULTADOS",
    description: "Tendrás acceso a la visualización y descarga de sus documentos digitales.",
    href: "/documentos",
    btnClassName:
      "bg-[#1a2f5a] hover:bg-[#152248] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors",
  },
  {
    icon: Calendar,
    iconBg: "#FCE4EC",
    iconColor: "#C2185B",
    title: "SOLICITUD DE CITAS",
    description:
      "Solicita tu cita según la disponibilidad del servicio o departamento correspondiente.",
    href: "/citas",
    btnClassName:
      "bg-[#C2185B] hover:bg-[#a01549] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors",
  },
  {
    icon: Search,
    iconBg: "#EDE7F6",
    iconColor: "#5E35B1",
    title: "CONSULTA TU CITA",
    description:
      "¿Quieres saber cuándo es tu próxima cita? Haz clic aquí y revisa los detalles al instante.",
    href: "/citas",
    btnClassName:
      "bg-[#5E35B1] hover:bg-[#4a2990] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors",
  },
];

/* ─── page ───────────────────────────────────────────── */

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const userId = user.id;
  const hoy = new Date().toISOString().split("T")[0];

  const [{ data: proximaCita }, { count: totalDocumentos }] = await Promise.all([
    supabase
      .from("citas")
      .select("servicio, fecha")
      .eq("paciente_id", userId)
      .in("estado", ["programada", "confirmada"])
      .gte("fecha", hoy)
      .order("fecha", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("documentos")
      .select("id", { count: "exact", head: true })
      .eq("paciente_id", userId),
  ]);

  const citaFechaFormateada = proximaCita
    ? new Date(proximaCita.fecha + "T00:00:00").toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
      })
    : null;

  /* proceso */
  let proceso = await getProceso(supabase, userId);

  const tieneProcesoValido = proceso.some((p) => p.pasos !== null);
  if (!tieneProcesoValido) {
    const { data: pasos, error: pasosError } = await supabase
      .from("pasos")
      .select("id, orden")
      .order("orden", { ascending: true });

    if (!pasosError && pasos && pasos.length > 0) {
      const { error: insertError } = await supabase.from("proceso_paciente").insert(
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
      value: citaFechaFormateada ?? "—",
      sub: citaFechaFormateada
        ? (proximaCita!.servicio ?? "Cita programada")
        : "Sin citas programadas",
      icon: <Calendar size={20} className="text-[#3B52A2]" />,
      iconBg: "bg-[#E8EAF0]",
    },
    {
      label: "Documentos",
      value: (totalDocumentos ?? 0).toString(),
      sub: "archivos subidos",
      icon: <FileText size={20} className="text-success" />,
      iconBg: "bg-green-50",
    },
    {
      label: "Etapa actual",
      value: etapaActual?.pasos?.nombre ?? "—",
      sub: "en curso",
      icon: <GitBranch size={20} className="text-warning" />,
      iconBg: "bg-yellow-50",
    },
    {
      label: "Mensajes",
      value: "0",
      sub: "sin leer",
      icon: <MessageCircle size={20} className="text-purple-600" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ── 3 tarjetas de acción ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ACTION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-7 flex flex-col gap-4 shadow-sm"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon size={22} style={{ color: card.iconColor }} />
              </div>
              <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 leading-snug">
                {card.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{card.description}</p>
              <div>
                <Link href={card.href}>
                  <button className={card.btnClassName}>Ingresar</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-0">
            <div className="p-5 flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted font-medium">{stat.label}</p>
                <p className="text-base font-bold text-foreground leading-tight truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-muted">{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Proceso + Citas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          estado === "completado"
                            ? "bg-success"
                            : estado === "en_curso"
                            ? "bg-[#3B52A2]"
                            : "bg-gray-200"
                        }`}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            estado === "pendiente" ? "text-muted" : "text-foreground"
                          }`}
                        >
                          {paso?.nombre ?? "—"}
                        </span>
                        <Badge
                          variant={
                            estado === "completado"
                              ? "success"
                              : estado === "en_curso"
                              ? "info"
                              : "default"
                          }
                        >
                          {estado === "completado"
                            ? "Completado"
                            : estado === "en_curso"
                            ? "En curso"
                            : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card title="Próximas Citas">
          {proximaCita ? (
            <div className="border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{proximaCita.servicio}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar size={12} />
                {citaFechaFormateada}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-4">
              No tienes citas programadas.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
