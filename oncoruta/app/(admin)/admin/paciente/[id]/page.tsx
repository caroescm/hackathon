import { createServiceClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import RevisarDocumento from "@/components/admin/RevisarDocumento";
import AgregarNota from "@/components/admin/AgregarNota";
import AprobarCita from "@/components/admin/AprobarCita";
import { getPrioridad } from "@/lib/utils/prioridad";
import { ArrowLeft, Check, Clock, Circle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ─── tipos ─────────────────────────────────────────── */

type PerfilVulnerabilidad = {
  jefa_hogar: boolean | null;
  de_provincia: boolean | null;
  tiene_discapacidad: boolean | null;
  habla_quechua: boolean | null;
} | null;

type Paciente = {
  id: string;
  nombre: string;
  dni: string | null;
  telefono: string | null;
  idioma: string | null;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
};

type PasoProceso = {
  id: string;
  estado: string;
  pasos: { nombre: string; descripcion: string | null; orden: number } | null;
};

type Documento = {
  id: string;
  nombre: string;
  estado: string;
  pasos: { nombre: string } | null;
};

type Cita = {
  id: string;
  servicio: string;
  fecha: string;
  hora: string | null;
  piso: string | null;
  estado: string;
};

type NotaInterna = {
  id: string;
  contenido: string;
  created_at: string;
};

/* ─── helpers ────────────────────────────────────────── */

const ESTADO_DOC_BADGE: Record<string, { variant: "info" | "warning" | "success" | "danger" | "default"; label: string }> = {
  enviado:     { variant: "info",    label: "Enviado" },
  en_revision: { variant: "warning", label: "En revisión" },
  aprobado:    { variant: "success", label: "Aprobado" },
  rechazado:   { variant: "danger",  label: "Rechazado" },
};

const ESTADO_CITA_BADGE: Record<string, { variant: "warning" | "success" | "default" | "danger"; label: string }> = {
  solicitada: { variant: "warning", label: "Solicitud pendiente" },
  programada: { variant: "warning", label: "Programada" },
  confirmada: { variant: "success", label: "Confirmada" },
  completada: { variant: "default", label: "Completada" },
};

const FLAGS_VULNERABILIDAD: { key: keyof NonNullable<PerfilVulnerabilidad>; label: string }[] = [
  { key: "jefa_hogar",         label: "Jefa de hogar" },
  { key: "de_provincia",    label: "Viene de provincia" },
  { key: "tiene_discapacidad", label: "Discapacidad" },
  { key: "habla_quechua",      label: "Habla quechua" },
];

function formatFecha(fecha: string) {
  try {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return fecha;
  }
}

/* ─── page ───────────────────────────────────────────── */

export default async function PacienteExpedientePage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();

  const [
    { data: paciente },
    { data: proceso },
    { data: documentos },
    { data: citas },
    { data: notas },
  ] = await Promise.all([
    supabase
      .from("usuarios")
      .select("*, perfil_vulnerabilidad(*)")
      .eq("id", params.id)
      .single(),
    supabase
      .from("proceso_paciente")
      .select("id, estado, pasos(nombre, descripcion, orden)")
      .eq("paciente_id", params.id)
      .order("orden", { referencedTable: "pasos", ascending: true }),
    supabase
      .from("documentos")
      .select("id, nombre, estado, pasos(nombre)")
      .eq("paciente_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("citas")
      .select("id, servicio, fecha, hora, piso, estado")
      .eq("paciente_id", params.id)
      .order("fecha", { ascending: true }),
    supabase
      .from("notas_internas")
      .select("id, contenido, created_at")
      .eq("paciente_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!paciente) notFound();

  const p = paciente as Paciente;
  const pasosProceso = (proceso as PasoProceso[] | null) ?? [];
  const listaDocumentos = (documentos as Documento[] | null) ?? [];
  const listaCitas = (citas as Cita[] | null) ?? [];
  const listaNotas = (notas as NotaInterna[] | null) ?? [];

  const flagsActivos = FLAGS_VULNERABILIDAD.filter(
    (f) => p.perfil_vulnerabilidad?.[f.key] === true
  );

  const prioridad = getPrioridad(p.perfil_vulnerabilidad);
  const PRIORIDAD_BADGE = {
    ALTA:  { variant: "danger"  as const, label: "Alta prioridad" },
    MEDIA: { variant: "warning" as const, label: "Media prioridad" },
  };

  return (
    <>
      <TopBar title="Expediente del Paciente" subtitle={p.nombre} />

      <div className="p-6 space-y-6">
        {/* Volver */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        {/* A. Info del paciente */}
        <Card title="Información del paciente">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted mb-0.5">Nombre completo</p>
              <p className="font-medium text-foreground">{p.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">DNI</p>
              <p className="font-medium text-foreground font-mono">{p.dni ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Teléfono</p>
              <p className="font-medium text-foreground">{p.telefono ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Idioma</p>
              <p className="font-medium text-foreground">{p.idioma ?? "—"}</p>
            </div>
          </div>
        </Card>

        {/* B. Perfil de vulnerabilidad */}
        <Card title="Perfil de vulnerabilidad">
          {flagsActivos.length === 0 ? (
            <p className="text-sm text-muted">Sin factores de vulnerabilidad registrados.</p>
          ) : (
            <div className="space-y-3">
              {prioridad !== "BAJA" && (
                <Badge variant={PRIORIDAD_BADGE[prioridad].variant}>
                  {PRIORIDAD_BADGE[prioridad].label}
                </Badge>
              )}
              <div className="flex flex-wrap gap-2">
                {flagsActivos.map((f) => (
                  <Badge key={f.key} variant="default">{f.label}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* C. Proceso */}
        <Card title="Proceso oncológico">
          {pasosProceso.length === 0 ? (
            <p className="text-sm text-muted">El proceso aún no ha sido configurado.</p>
          ) : (
            <ol className="relative space-y-0">
              {pasosProceso.map((pp, i) => {
                const esUltimo = i === pasosProceso.length - 1;
                const completado = pp.estado === "completado";
                const enCurso = pp.estado === "en_curso";

                return (
                  <li key={pp.id} className="flex gap-4">
                    {/* línea + ícono */}
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        completado ? "bg-success text-white" :
                        enCurso    ? "bg-primary text-white ring-4 ring-primary/20" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {completado ? <Check size={13} /> : enCurso ? <Clock size={13} /> : <Circle size={13} />}
                      </div>
                      {!esUltimo && <div className="w-px flex-1 bg-gray-200 my-1" />}
                    </div>

                    {/* contenido */}
                    <div className={`pb-6 ${esUltimo ? "" : ""}`}>
                      <p className={`text-sm font-semibold ${completado || enCurso ? "text-foreground" : "text-muted"}`}>
                        {pp.pasos?.nombre ?? `Paso ${i + 1}`}
                      </p>
                      {pp.pasos?.descripcion && (
                        <p className="text-xs text-muted mt-0.5">{pp.pasos.descripcion}</p>
                      )}
                      {enCurso && (
                        <span className="inline-block mt-1 text-xs font-medium text-primary">En curso</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        {/* D. Documentos */}
        <Card title="Documentos" description={listaDocumentos.length > 0 ? `${listaDocumentos.length} archivo${listaDocumentos.length !== 1 ? "s" : ""}` : undefined}>
          {listaDocumentos.length === 0 ? (
            <p className="text-sm text-muted">La paciente aún no ha subido documentos.</p>
          ) : (
            <div className="space-y-3">
              {listaDocumentos.map((doc) => {
                const badge = ESTADO_DOC_BADGE[doc.estado] ?? { variant: "default" as const, label: doc.estado };
                const revisable = doc.estado === "enviado" || doc.estado === "en_revision";
                return (
                  <div key={doc.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.nombre}</p>
                        {doc.pasos?.nombre && (
                          <p className="text-xs text-muted">{doc.pasos.nombre}</p>
                        )}
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    {revisable && <RevisarDocumento documentoId={doc.id} />}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* E. Citas */}
        <Card title="Citas">
          {listaCitas.length === 0 ? (
            <p className="text-sm text-muted">No hay citas registradas para esta paciente.</p>
          ) : (
            <div className="space-y-2">
              {listaCitas.map((cita) => {
                const badge = ESTADO_CITA_BADGE[cita.estado] ?? { variant: "default" as const, label: cita.estado };
                return (
                  <div key={cita.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{cita.servicio}</p>
                        {cita.estado !== "solicitada" && (
                          <p className="text-xs text-muted">
                            {formatFecha(cita.fecha)}{cita.hora ? ` · ${cita.hora}` : ""}{cita.piso ? ` · ${cita.piso}` : ""}
                          </p>
                        )}
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    {cita.estado === "solicitada" && (
                      <AprobarCita citaId={cita.id} servicioLabel={cita.servicio} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* F. Notas internas */}
        <Card>
          <div className="space-y-4">
            {/* Encabezado */}
            <div className="flex items-center gap-2">
              <LockKeyhole size={15} className="text-muted flex-shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">Notas internas</h3>
              <span className="text-xs text-muted">(solo visible para el equipo)</span>
            </div>

            {/* Lista de notas */}
            {listaNotas.length === 0 ? (
              <p className="text-sm text-muted">No hay notas registradas para esta paciente.</p>
            ) : (
              <ul className="space-y-3">
                {listaNotas.map((nota) => (
                  <li key={nota.id} className="border border-border rounded-lg p-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{nota.contenido}</p>
                    <p className="text-xs text-muted mt-1.5">
                      {new Date(nota.created_at).toLocaleString("es-PE", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Formulario */}
            <AgregarNota pacienteId={params.id} />
          </div>
        </Card>
      </div>
    </>
  );
}
