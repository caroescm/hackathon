import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { FileText, Download, Upload } from "lucide-react";

const documentos = [
  { nombre: "Informe de Biopsia", tipo: "Diagnóstico", fecha: "12 Mar 2024", size: "1.2 MB" },
  { nombre: "Resultado de Mamografía", tipo: "Imagen", fecha: "10 Mar 2024", size: "3.5 MB" },
  { nombre: "Protocolo de Quimioterapia", tipo: "Tratamiento", fecha: "05 May 2024", size: "450 KB" },
  { nombre: "Análisis de Sangre - Mayo", tipo: "Laboratorio", fecha: "28 May 2024", size: "210 KB" },
  { nombre: "Consentimiento Informado Cirugía", tipo: "Administrativo", fecha: "02 Abr 2024", size: "380 KB" },
];

const tipoVariant: Record<string, "info" | "success" | "warning" | "default"> = {
  "Diagnóstico": "danger" as any,
  "Imagen": "info",
  "Tratamiento": "warning",
  "Laboratorio": "success",
  "Administrativo": "default",
};

export default function DocumentosPage() {
  return (
    <>
      <TopBar title="Mis Documentos" subtitle="Historial médico y resultados" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button size="sm">
            <Upload size={16} />
            Subir documento
          </Button>
        </div>

        <Card title="Documentos" description={`${documentos.length} archivos en tu expediente`}>
          <div className="space-y-2">
            {documentos.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.nombre}</p>
                    <p className="text-xs text-muted">{doc.fecha} · {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={tipoVariant[doc.tipo] ?? "default"}>{doc.tipo}</Badge>
                  <button className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-light transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
