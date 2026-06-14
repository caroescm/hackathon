import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Check } from "lucide-react";

type EstadoPaso = "completado" | "en_curso" | "pendiente";

type ProcesoPasoRow = {
  id: string;
  estado: EstadoPaso;
  pasos: {
    id: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
  } | null;
};

export default async function ProcesoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let pasos: ProcesoPasoRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("proceso_paciente")
      .select("id, estado, pasos(id, nombre, descripcion, orden)")
      .eq("paciente_id", user.id)
      .order("orden", { referencedTable: "pasos", ascending: true });

    pasos = (data as ProcesoPasoRow[] | null) ?? [];
  }

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Mi Proceso</h1>
        <p className="text-sm text-gray-500">Seguimiento de tu tratamiento oncológico</p>
      </div>
      <div className="p-6 space-y-6">
        <Card title="Etapas del Tratamiento" description="Tu recorrido personalizado en el INEN">
          {pasos.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">
              Tu proceso aún no ha sido configurado. Contacta a la asistenta social.
            </p>
          ) : (
            <div className="relative">
              {/* Línea vertical del timeline */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {pasos.map((item, i) => {
                  const paso = item.pasos;
                  const estado = item.estado;

                  const circleClass =
                    estado === "completado"
                      ? "bg-success text-white"
                      : estado === "en_curso"
                      ? "bg-primary text-white ring-4 ring-primary-light"
                      : "bg-white border-2 border-border text-muted";

                  const badgeVariant =
                    estado === "completado" ? "success" :
                    estado === "en_curso"   ? "info"    : "default";

                  const badgeLabel =
                    estado === "completado" ? "Completado" :
                    estado === "en_curso"   ? "En curso"  : "Pendiente";

                  return (
                    <div key={item.id} className="flex gap-4 relative">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${circleClass}`}>
                        {estado === "completado"
                          ? <Check size={16} strokeWidth={3} />
                          : i + 1}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`text-sm font-semibold ${estado === "pendiente" ? "text-muted" : "text-foreground"}`}>
                            {paso?.nombre ?? "—"}
                          </h3>
                          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                        </div>
                        {paso?.descripcion && (
                          <p className="text-sm text-muted">{paso.descripcion}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
