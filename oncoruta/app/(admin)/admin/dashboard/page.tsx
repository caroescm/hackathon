import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Users, Calendar, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

const pacientes = [
  { id: "1", nombre: "Ana García López", historia: "HC-2024-001", etapa: "Quimioterapia", estado: "activo", cita: "15 Jun" },
  { id: "2", nombre: "Rosa Martínez", historia: "HC-2024-002", etapa: "Radioterapia", estado: "activo", cita: "16 Jun" },
  { id: "3", nombre: "Carmen Díaz", historia: "HC-2024-003", etapa: "Seguimiento", estado: "activo", cita: "20 Jun" },
  { id: "4", nombre: "Lucía Torres", historia: "HC-2024-004", etapa: "Diagnóstico", estado: "nuevo", cita: "17 Jun" },
];

const stats = [
  { label: "Pacientes activos", value: "124", icon: <Users size={20} className="text-primary" />, color: "bg-primary-light" },
  { label: "Citas hoy", value: "18", icon: <Calendar size={20} className="text-success" />, color: "bg-green-50" },
  { label: "Documentos pendientes", value: "7", icon: <FileText size={20} className="text-warning" />, color: "bg-yellow-50" },
  { label: "Alertas", value: "3", icon: <AlertCircle size={20} className="text-danger" />, color: "bg-red-50" },
];

export default function AdminDashboardPage() {
  return (
    <>
      <TopBar title="Panel Administrativo" subtitle="Gestión de pacientes OncoRuta" />
      <div className="p-6 space-y-6">
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

        <Card title="Pacientes Recientes" description="Lista de pacientes registrados">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Paciente</th>
                  <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">N° Historia</th>
                  <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Etapa</th>
                  <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Próxima cita</th>
                  <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-foreground">{p.nombre}</td>
                    <td className="py-3 text-muted font-mono text-xs">{p.historia}</td>
                    <td className="py-3">
                      <Badge variant="info">{p.etapa}</Badge>
                    </td>
                    <td className="py-3 text-muted">{p.cita}</td>
                    <td className="py-3">
                      <Badge variant={p.estado === "nuevo" ? "warning" : "success"}>
                        {p.estado === "nuevo" ? "Nuevo" : "Activo"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/paciente/${p.id}`}
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Ver expediente
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
