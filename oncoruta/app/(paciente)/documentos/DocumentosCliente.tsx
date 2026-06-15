"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SubirDocumento from "@/components/documentos/SubirDocumento";
import { FileText } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

type Documento = {
  id: string;
  nombre: string;
  estado: string;
  subido_en: string;
  pasos: { nombre: string } | null;
};

const estadoVariant: Record<string, "info" | "warning" | "success" | "danger" | "default"> = {
  enviado:     "info",
  en_revision: "warning",
  aprobado:    "success",
  rechazado:   "danger",
};

function formatFecha(fechaISO: string) {
  try {
    return new Date(fechaISO).toLocaleDateString("es-PE", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return fechaISO;
  }
}

export default function DocumentosCliente({ documentos }: { documentos: Documento[] }) {
  const { t } = useIdioma();

  function estadoLabel(estado: string) {
    if (estado === "enviado") return t.enviado;
    if (estado === "en_revision") return t.enRevision;
    if (estado === "aprobado") return t.aprobado;
    if (estado === "rechazado") return t.rechazado;
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">{t.misDocumentosTitulo}</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">{t.misDocumentosSubtitle}</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <SubirDocumento triggerLabel={t.subirDocumento} />
        </div>

        <Card
          title={t.documentos}
          description={documentos.length > 0 ? `${documentos.length} archivo${documentos.length !== 1 ? "s" : ""} en tu expediente` : undefined}
        >
          {documentos.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">{t.sinDocumentos}</p>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.nombre}</p>
                      <p className="text-xs text-muted">
                        {formatFecha(doc.subido_en)}
                        {doc.pasos?.nombre ? ` · ${doc.pasos.nombre}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant={estadoVariant[doc.estado] ?? "default"}>
                    {estadoLabel(doc.estado)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
