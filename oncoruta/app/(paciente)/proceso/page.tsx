import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { type EtapaProceso } from "@/lib/supabase/types";

const etapas: { id: EtapaProceso; label: string; descripcion: string; estado: "completada" | "activa" | "pendiente" }[] = [
  { id: "diagnostico", label: "Diagnóstico", descripcion: "Confirmación del diagnóstico, biopsias y estadificación del cáncer.", estado: "completada" },
  { id: "cirugia", label: "Cirugía", descripcion: "Procedimiento quirúrgico para extirpar el tumor. Puede ser mastectomía o tumorectomía.", estado: "completada" },
  { id: "quimioterapia", label: "Quimioterapia", descripcion: "Tratamiento con medicamentos para destruir células cancerosas. Ciclos cada 3 semanas.", estado: "activa" },
  { id: "radioterapia", label: "Radioterapia", descripcion: "Uso de radiación para eliminar células cancerosas residuales en la zona afectada.", estado: "pendiente" },
  { id: "hormonoterapia", label: "Hormonoterapia", descripcion: "Tratamiento para bloquear hormonas que estimulan el crecimiento de tumores hormonodependientes.", estado: "pendiente" },
  { id: "seguimiento", label: "Seguimiento", descripcion: "Controles periódicos para detectar recaídas y evaluar secuelas del tratamiento.", estado: "pendiente" },
];

export default function ProcesoPage() {
  return (
    <>
      <TopBar title="Mi Proceso" subtitle="Seguimiento de tu tratamiento oncológico" />
      <div className="p-6 space-y-6">
        <Card title="Etapas del Tratamiento" description="Tu recorrido personalizado en el INEN">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {etapas.map((etapa, i) => (
                <div key={etapa.id} className="flex gap-4 relative">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    etapa.estado === "completada" ? "bg-success text-white" :
                    etapa.estado === "activa" ? "bg-primary text-white ring-4 ring-primary-light" :
                    "bg-white border-2 border-border text-muted"
                  }`}>
                    {etapa.estado === "completada" ? "✓" : i + 1}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-sm font-semibold ${etapa.estado === "pendiente" ? "text-muted" : "text-foreground"}`}>
                        {etapa.label}
                      </h3>
                      <Badge variant={
                        etapa.estado === "completada" ? "success" :
                        etapa.estado === "activa" ? "info" : "default"
                      }>
                        {etapa.estado === "completada" ? "Completada" :
                         etapa.estado === "activa" ? "En curso" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">{etapa.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
