import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Check } from "lucide-react";

type EstadoPaso = "completado" | "en_curso" | "pendiente";
type TipoPaciente = "preventivo" | "sospecha" | "diagnosticado";

type PasoDisplay = {
  id: string;
  nombre: string;
  descripcion: string | null;
  estado: EstadoPaso;
};

type ProcesoPasoRow = {
  id: string;
  estado: EstadoPaso;
  pasos: {
    id: string;
    nombre: string;
    descripcion: string | null;
    orden: number;
  } | null;
};

const PASOS_HARDCODED: Record<TipoPaciente, Array<{ nombre: string; descripcion: string | null }>> = {
  preventivo: [
    { nombre: "Agendar examen preventivo", descripcion: "Presentar DNI y SIS" },
    { nombre: "Examen (mamografía o Papanicolaou)", descripcion: "Duración aproximada 30 minutos" },
    { nombre: "Resultado y recomendación", descripcion: "Próximo control en 1-2 años" },
  ],
  sospecha: [
    { nombre: "Preparación", descripcion: "DNI, hoja de referencia, documentos clínicos" },
    { nombre: "Admisión y evaluación", descripcion: null },
    { nombre: "Apertura de HC y asignación de cita", descripcion: null },
    { nombre: "Primera consulta con especialista", descripcion: null },
    { nombre: "Exámenes de apoyo diagnóstico", descripcion: null },
    { nombre: "Evaluación diagnóstica y resultado", descripcion: null },
  ],
  diagnosticado: [
    { nombre: "Plan de tratamiento", descripcion: "Cirugía / quimio / radio / combinado" },
    { nombre: "Tratamiento activo", descripcion: "Seguir indicaciones, subir resultados" },
    { nombre: "Control y seguimiento", descripcion: "Citas de control periódicas" },
    { nombre: "Alta o mantenimiento", descripcion: null },
  ],
};

const TIPO_LABEL: Record<TipoPaciente, string> = {
  preventivo: "Chequeo Preventivo",
  sospecha: "Evaluación por Sospecha",
  diagnosticado: "Tratamiento Oncológico",
};

export default async function ProcesoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [procesoDB, usuarioDB] = await Promise.all([
    supabase
      .from("proceso_paciente")
      .select("id, estado, pasos(id, nombre, descripcion, orden)")
      .eq("paciente_id", user.id)
      .order("orden", { referencedTable: "pasos", ascending: true }),
    supabase
      .from("usuarios")
      .select("tipo_paciente")
      .eq("id", user.id)
      .single(),
  ]);

  const tipoPaciente = (usuarioDB.data?.tipo_paciente as TipoPaciente | null) ?? "sospecha";
  const procesoDB_rows = (procesoDB.data as ProcesoPasoRow[] | null) ?? [];
  const tieneProcesoReal = procesoDB_rows.some((p) => p.pasos !== null);

  let pasos: PasoDisplay[];

  if (tieneProcesoReal) {
    pasos = procesoDB_rows
      .filter((p) => p.pasos !== null)
      .map((p) => ({
        id: p.id,
        nombre: p.pasos!.nombre,
        descripcion: p.pasos!.descripcion,
        estado: p.estado,
      }));
  } else {
    const hardcoded = PASOS_HARDCODED[tipoPaciente] ?? PASOS_HARDCODED.sospecha;
    pasos = hardcoded.map((p, i) => ({
      id: `hardcoded-${i}`,
      nombre: p.nombre,
      descripcion: p.descripcion,
      estado: (i === 0 ? "en_curso" : "pendiente") as EstadoPaso,
    }));
  }

  const subtitulo = TIPO_LABEL[tipoPaciente] ?? "Tu recorrido en el INEN";

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Mi Proceso</h1>
        <p className="text-sm text-gray-500">Seguimiento de tu tratamiento oncológico</p>
      </div>
      <div className="p-6 space-y-6">
        <Card title="Etapas del Tratamiento" description={subtitulo}>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {pasos.map((paso, i) => {
                const estado = paso.estado;

                const circleClass =
                  estado === "completado"
                    ? "bg-success text-white"
                    : estado === "en_curso"
                    ? "bg-primary text-white ring-4 ring-primary-light"
                    : "bg-white border-2 border-border text-muted";

                const badgeVariant =
                  estado === "completado" ? "success" :
                  estado === "en_curso"   ? "info"    : "default";

                const badgeLabel =
                  estado === "completado" ? "Completado" :
                  estado === "en_curso"   ? "En curso"  : "Pendiente";

                return (
                  <div key={paso.id} className="flex gap-4 relative">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${circleClass}`}>
                      {estado === "completado"
                        ? <Check size={16} strokeWidth={3} />
                        : i + 1}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-sm font-semibold ${estado === "pendiente" ? "text-muted" : "text-foreground"}`}>
                          {paso.nombre}
                        </h3>
                        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                      </div>
                      {paso.descripcion && (
                        <p className="text-sm text-muted">{paso.descripcion}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
