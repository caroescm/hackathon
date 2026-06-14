import { createClient } from "@/lib/supabase/server";
import ProcesoCliente, { type PasoDisplay } from "./ProcesoCliente";

type EstadoPaso = "completado" | "en_curso" | "pendiente";
type TipoPaciente = "preventivo" | "sospecha" | "diagnosticado";

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
        orden: p.pasos!.orden,
      }));
  } else {
    const hardcoded = PASOS_HARDCODED[tipoPaciente] ?? PASOS_HARDCODED.sospecha;
    pasos = hardcoded.map((p, i) => ({
      id: `hardcoded-${i}`,
      nombre: p.nombre,
      descripcion: p.descripcion,
      estado: (i === 0 ? "en_curso" : "pendiente") as EstadoPaso,
      orden: i,
    }));
  }

  return <ProcesoCliente pasos={pasos} tipoPaciente={tipoPaciente} />;
}
