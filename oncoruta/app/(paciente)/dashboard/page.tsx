import { createClient } from "@/lib/supabase/server";
import DashboardCliente from "./DashboardCliente";

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

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const userId = user.id;
  const hoy = new Date().toISOString().split("T")[0];

  const [{ data: proximaCitaRaw }, { count: totalDocumentos }] = await Promise.all([
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

  const citaFechaFormateada = proximaCitaRaw
    ? new Date(proximaCitaRaw.fecha + "T00:00:00").toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
      })
    : null;

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
  const etapaActualNombre = etapaActual?.pasos?.nombre ?? null;

  return (
    <DashboardCliente
      proximaCita={proximaCitaRaw as { servicio: string; fecha: string } | null}
      citaFechaFormateada={citaFechaFormateada}
      totalDocumentos={totalDocumentos ?? 0}
      proceso={proceso}
      etapaActualNombre={etapaActualNombre}
    />
  );
}
