import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { FileText, Upload } from "lucide-react";

type Documento = {
  id: string;
  nombre: string;
  estado: string;
  created_at: string;
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

export default async function DocumentosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("documentos")
        .select("id, nombre, estado, created_at, pasos(nombre)")
        .eq("paciente_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  const documentos = (data as Documento[] | null) ?? [];

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

        <Card
          title="Documentos"
          description={documentos.length > 0 ? `${documentos.length} archivo${documentos.length !== 1 ? "s" : ""} en tu expediente` : undefined}
        >
          {documentos.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">Aún no has subido documentos.</p>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.nombre}</p>
                      <p className="text-xs text-muted">
                        {formatFecha(doc.created_at)}
                        {doc.pasos?.nombre ? ` · ${doc.pasos.nombre}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant={estadoVariant[doc.estado] ?? "default"}>
                    {doc.estado === "en_revision" ? "En revisión" : doc.estado.charAt(0).toUpperCase() + doc.estado.slice(1)}
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
