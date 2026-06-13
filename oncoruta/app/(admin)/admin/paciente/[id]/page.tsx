import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ArrowLeft, Calendar, FileText, Phone } from "lucide-react";
import Link from "next/link";

export default function PacienteExpedientePage({ params }: { params: { id: string } }) {
  const paciente = {
    nombre: "Ana García López",
    historia: "HC-2024-001",
    dni: "12345678",
    telefono: "+51 999 888 777",
    fechaNacimiento: "15 Mar 1975",
    diagnostico: "Carcinoma ductal invasivo de mama izquierda",
    estadio: "IIB",
    etapa: "Quimioterapia",
    medico: "Dra. María Torres",
    fechaDiagnostico: "10 Mar 2024",
  };

  return (
    <>
      <TopBar title="Expediente del Paciente" subtitle={paciente.historia} />
      <div className="p-6 space-y-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card title="Información del Paciente">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted mb-0.5">Nombre completo</p>
                  <p className="font-medium text-foreground">{paciente.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">DNI</p>
                  <p className="font-medium text-foreground">{paciente.dni}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Fecha de nacimiento</p>
                  <p className="font-medium text-foreground">{paciente.fechaNacimiento}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Teléfono</p>
                  <p className="font-medium text-foreground">{paciente.telefono}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted mb-0.5">Diagnóstico</p>
                  <p className="font-medium text-foreground">{paciente.diagnostico}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Estadio</p>
                  <Badge variant="danger">{paciente.estadio}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Fecha de diagnóstico</p>
                  <p className="font-medium text-foreground">{paciente.fechaDiagnostico}</p>
                </div>
              </div>
            </Card>

            <Card title="Acciones Rápidas">
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="secondary">
                  <Calendar size={14} />
                  Agendar cita
                </Button>
                <Button size="sm" variant="secondary">
                  <FileText size={14} />
                  Subir documento
                </Button>
                <Button size="sm" variant="secondary">
                  <Phone size={14} />
                  Enviar WhatsApp
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Estado del Proceso">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Etapa actual</span>
                  <Badge variant="info">{paciente.etapa}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Médico tratante</span>
                  <span className="font-medium text-foreground text-xs">{paciente.medico}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">N° Historia</span>
                  <span className="font-mono text-xs text-foreground">{paciente.historia}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
