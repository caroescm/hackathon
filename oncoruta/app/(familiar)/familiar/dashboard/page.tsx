import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function FamiliarDashboardPage() {
  return (
    <>
      <TopBar title="Panel Familiar" subtitle="Seguimiento del proceso de tu ser querido" />
      <div className="p-6 space-y-6">
        <Card title="Estado actual de Ana García" description="Actualizado hoy a las 9:00 AM">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Etapa actual</span>
              <Badge variant="info">Quimioterapia - Ciclo 3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Próxima cita</span>
              <span className="text-sm font-medium text-foreground">15 Jun - Oncología</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Médico tratante</span>
              <span className="text-sm font-medium text-foreground">Dra. María Torres</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Estado general</span>
              <Badge variant="warning">Requiere acompañamiento</Badge>
            </div>
          </div>
        </Card>

        <Card title="Recomendaciones para el cuidador">
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              Acompaña a la paciente a sus citas médicas siempre que sea posible.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              Asegúrate de que tome sus medicamentos a las horas indicadas.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              Prepara comidas nutritivas y de fácil digestión durante la quimioterapia.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              Escucha activamente y valida sus emociones sin minimizar lo que siente.
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
