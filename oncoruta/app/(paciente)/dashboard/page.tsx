import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Calendar, FileText, GitBranch, MessageCircle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const nombre = user?.user_metadata?.full_name?.split(" ")[0] ?? "Paciente";

  const stats = [
    { label: "Próxima cita", value: "15 Jun", sub: "Oncología", icon: <Calendar size={20} className="text-primary" />, color: "bg-primary-light" },
    { label: "Documentos", value: "8", sub: "archivos subidos", icon: <FileText size={20} className="text-success" />, color: "bg-green-50" },
    { label: "Etapa actual", value: "Quimioterapia", sub: "Ciclo 3 de 6", icon: <GitBranch size={20} className="text-warning" />, color: "bg-yellow-50" },
    { label: "Mensajes", value: "2", sub: "sin leer", icon: <MessageCircle size={20} className="text-purple-600" />, color: "bg-purple-50" },
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
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.sub}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proceso */}
          <div className="lg:col-span-2">
            <Card title="Mi Proceso de Tratamiento">
              <div className="space-y-3">
                {[
                  { etapa: "Diagnóstico", fecha: "Mar 2024", estado: "completada" },
                  { etapa: "Cirugía", fecha: "Abr 2024", estado: "completada" },
                  { etapa: "Quimioterapia", fecha: "Jun 2024", estado: "activa" },
                  { etapa: "Radioterapia", fecha: "Oct 2024", estado: "pendiente" },
                  { etapa: "Seguimiento", fecha: "Ene 2025", estado: "pendiente" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.estado === "completada" ? "bg-success" :
                      item.estado === "activa" ? "bg-primary" : "bg-gray-200"
                    }`} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-sm font-medium ${item.estado === "pendiente" ? "text-muted" : "text-foreground"}`}>
                        {item.etapa}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">{item.fecha}</span>
                        <Badge variant={
                          item.estado === "completada" ? "success" :
                          item.estado === "activa" ? "info" : "default"
                        }>
                          {item.estado === "completada" ? "Completada" :
                           item.estado === "activa" ? "En curso" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Próximas citas */}
          <Card title="Próximas Citas">
            <div className="space-y-3">
              {[
                { tipo: "Oncología", fecha: "15 Jun", hora: "10:00 AM", lugar: "Consultorio 3" },
                { tipo: "Laboratorio", fecha: "18 Jun", hora: "8:00 AM", lugar: "Lab. Clínico" },
                { tipo: "Nutrición", fecha: "22 Jun", hora: "3:00 PM", lugar: "Consultorio 7" },
              ].map((cita, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 text-center flex-shrink-0">
                    <p className="text-xs font-bold text-primary">{cita.fecha.split(" ")[0]}</p>
                    <p className="text-xs text-muted">{cita.fecha.split(" ")[1]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{cita.tipo}</p>
                    <p className="text-xs text-muted">{cita.hora} · {cita.lugar}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
