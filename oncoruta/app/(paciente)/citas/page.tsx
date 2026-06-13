import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const citas = [
  { tipo: "Oncología Médica", medico: "Dra. Torres", fecha: "15 Jun 2024", hora: "10:00 AM", lugar: "Consultorio 3 - Piso 2", estado: "confirmada" },
  { tipo: "Laboratorio", medico: "Técnico de laboratorio", fecha: "18 Jun 2024", hora: "8:00 AM", lugar: "Laboratorio Clínico - Piso 1", estado: "pendiente" },
  { tipo: "Nutrición Oncológica", medico: "Lic. Mendoza", fecha: "22 Jun 2024", hora: "3:00 PM", lugar: "Consultorio 7 - Piso 3", estado: "pendiente" },
  { tipo: "Oncología Médica", medico: "Dra. Torres", fecha: "6 May 2024", hora: "10:00 AM", lugar: "Consultorio 3 - Piso 2", estado: "completada" },
];

const estadoVariant: Record<string, "success" | "info" | "warning" | "default"> = {
  confirmada: "success",
  pendiente: "warning",
  completada: "default",
  cancelada: "danger" as any,
};

export default function CitasPage() {
  const proximas = citas.filter((c) => c.estado !== "completada");
  const pasadas = citas.filter((c) => c.estado === "completada");

  return (
    <>
      <TopBar title="Mis Citas" subtitle="Agenda médica en el INEN" />
      <div className="p-6 space-y-6">
        <Card title="Próximas Citas" description={`${proximas.length} citas programadas`}>
          <div className="space-y-3">
            {proximas.map((cita, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{cita.tipo}</h3>
                  <Badge variant={estadoVariant[cita.estado]}>
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {cita.fecha}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {cita.hora}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {cita.lugar}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    {cita.medico}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {pasadas.length > 0 && (
          <Card title="Citas Anteriores">
            <div className="space-y-3">
              {pasadas.map((cita, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted">{cita.tipo}</p>
                    <p className="text-xs text-muted">{cita.fecha} · {cita.hora}</p>
                  </div>
                  <Badge variant="default">Completada</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
