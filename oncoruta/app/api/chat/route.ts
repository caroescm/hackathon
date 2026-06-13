import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function formatFecha(fecha: string) {
  try {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      weekday: "long", day: "numeric", month: "long",
    });
  } catch {
    return fecha;
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }

  const service = createServiceClient();
  const hoy = new Date().toISOString().split("T")[0];

  const [
    { data: proceso, error: procesoError },
    { data: citas, error: citasError },
    { data: documentos, error: documentosError },
  ] = await Promise.all([
    service
      .from("proceso_paciente")
      .select("estado, pasos(nombre)")
      .eq("paciente_id", user.id)
      .eq("estado", "en_curso")
      .limit(1),
    service
      .from("citas")
      .select("servicio, fecha, hora, piso")
      .eq("paciente_id", user.id)
      .in("estado", ["programada", "confirmada"])
      .gte("fecha", hoy)
      .order("fecha", { ascending: true })
      .limit(3),
    service
      .from("documentos")
      .select("id")
      .eq("paciente_id", user.id)
      .eq("estado", "enviado"),
  ]);

  if (procesoError || citasError || documentosError) {
    return NextResponse.json({ error: "Error al obtener información del paciente" }, { status: 500 });
  }

  const pasoActual = (proceso as unknown as Array<{ estado: string; pasos: { nombre: string } | null }> | null)?.[0];
  const paso_actual = pasoActual?.pasos?.nombre ?? "No hay paso activo";
  const estado_paso = pasoActual?.estado ?? "—";

  const proximas_citas = (citas ?? []).map((c) => ({
    tipo: c.servicio,
    fecha: formatFecha(c.fecha),
    hora: c.hora ?? "Por confirmar",
    lugar: c.piso ?? "Por confirmar",
  }));

  const documentos_pendientes = (documentos ?? []).length;

  const citasTexto =
    proximas_citas.length > 0
      ? proximas_citas
          .map((c) => `${c.tipo} el ${c.fecha} a las ${c.hora} en ${c.lugar}`)
          .join("; ")
      : "No hay citas próximas registradas";

  const systemPrompt = `Eres una asistente virtual del INEN (Instituto Nacional de Enfermedades Neoplásicas del Perú). Ayudas a pacientes oncológicas a entender su proceso de atención.

Información actual de la paciente:
- Paso actual: ${paso_actual} (${estado_paso})
- Próximas citas: ${citasTexto}
- Documentos pendientes de subir: ${documentos_pendientes}

Responde siempre en español simple y empático. Máximo 3 oraciones por respuesta. No inventes información médica ni diagnósticos. Si preguntan algo clínico, deriva a su médico tratante. Si necesitan ayuda urgente, da el número del INEN: (01) 201-6000.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content ?? "Lo siento, no pude procesar tu mensaje. Por favor intenta de nuevo.";

  return NextResponse.json({ reply });
}
