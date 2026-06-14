import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SolicitarCita from "@/components/paciente/SolicitarCita";
import { Calendar, Clock, MapPin } from "lucide-react";

type Cita = {
  id: string;
  servicio: string;
  fecha: string;
  hora: string | null;
  piso: string | null;
  estado: string;
};

const estadoVariant: Record<string, "success" | "info" | "warning" | "default" | "danger"> = {
  confirmada: "success",
  programada: "warning",
  completada: "default",
  cancelada: "danger",
};

function formatFecha(fecha: string) {
  try {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return fecha;
  }
}

export default async function CitasPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("citas")
        .select("id, servicio, fecha, hora, piso, estado")
        .eq("paciente_id", user.id)
        .order("fecha", { ascending: true })
    : { data: null };

  const citas = (data as Cita[] | null) ?? [];
  const proximas = citas.filter((c) => c.estado !== "completada" && c.estado !== "cancelada");
  const pasadas = citas.filter((c) => c.estado === "completada" || c.estado === "cancelada");

  return (
    <>
      <TopBar title="Mis Citas" subtitle="Agenda médica en el INEN" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <SolicitarCita />
        </div>
        <Card
          title="Próximas Citas"
          description={proximas.length > 0 ? `${proximas.length} cita${proximas.length !== 1 ? "s" : ""} programada${proximas.length !== 1 ? "s" : ""}` : undefined}
        >
          {proximas.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No tienes citas próximas programadas.</p>
          ) : (
            <div className="space-y-3">
              {proximas.map((cita) => (
                <div key={cita.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">{cita.servicio}</h3>
                    <Badge variant={estadoVariant[cita.estado] ?? "default"}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatFecha(cita.fecha)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {cita.hora ?? "Por confirmar"}
                    </div>
                    {cita.piso && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin size={12} />
                        {cita.piso}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {pasadas.length > 0 && (
          <Card title="Citas Anteriores">
            <div className="space-y-3">
              {pasadas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted">{cita.servicio}</p>
                    <p className="text-xs text-muted">{formatFecha(cita.fecha)}{cita.hora ? ` · ${cita.hora}` : ""}</p>
                  </div>
                  <Badge variant={estadoVariant[cita.estado] ?? "default"}>
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
