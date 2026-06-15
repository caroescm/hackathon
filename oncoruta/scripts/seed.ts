/**
 * seed.ts — datos demo para la presentación del hackathon OncoRuta
 *
 * Uso:
 *   npm run seed
 *
 * Idempotente: puedes ejecutarlo varias veces sin duplicar datos.
 * Los pacientes extra no crean usuarios en Auth — solo filas en la tabla `usuarios`.
 *
 * Schema real verificado en la DB (difiere del código en algunos puntos):
 *   usuarios       : id, dni, nombre, telefono, email, rol, idioma, creado_en
 *                    ⚠️  tipo_paciente NO existe → ProcesoPage siempre usa fallback "sospecha"
 *   citas          : id, paciente_id, paso_id, fecha, hora, servicio, piso, que_llevar, estado
 *   documentos     : id, paciente_id, paso_id, nombre, url, estado, comentario_admin, subido_en
 *                    ⚠️  tipo y descripcion NO existen (SubirDocumento los inserta — bug)
 *   proceso_paciente: id, paciente_id, paso_id, estado, fecha_inicio, fecha_fin
 *   pasos          : id, nombre, descripcion, orden, tiempo_estimado, que_llevar
 *   doctores       : id, nombre, especialidad, email, telefono, activo (bool), created_at
 *                    ⚠️  estado NO existe — AgregarDoctor.tsx lo inserta como texto (bug)
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Faltan variables de entorno. Verifica tu .env.local:");
  console.error("    NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── UUIDs fijos para pacientes extra (reproducibles) ────────────────────────
const ID_MARIA   = "a1b2c3d4-0001-4000-8000-000000000001";
const ID_CARMEN  = "a1b2c3d4-0002-4000-8000-000000000002";
const ID_JULIA   = "a1b2c3d4-0003-4000-8000-000000000003";
const ID_ANA     = "a1b2c3d4-0004-4000-8000-000000000004";

// El login usa DNI como campo visible y construye el email como `${dni}@inen.gob.pe`
const DEMO_DNI      = "47382910";
const DEMO_EMAIL    = `${DEMO_DNI}@inen.gob.pe`;
const DEMO_PASSWORD = "Demo1234!";

const resumen: Record<string, number> = {
  auth_users: 0,
  usuarios: 0,
  perfil_vulnerabilidad: 0,
  pasos: 0,
  proceso_paciente: 0,
  citas: 0,
  documentos: 0,
  notas_internas: 0,
  doctores: 0,
};

function log(msg: string) { console.log(`  ${msg}`); }

// ─── helpers ─────────────────────────────────────────────────────────────────

async function upsertUsuario(row: {
  id: string;
  dni: string;
  nombre: string;
  telefono: string;
  email: string | null;
  rol: "paciente" | "admin";
  idioma: "es" | "qu";
}) {
  const { error } = await supabase.from("usuarios").upsert(row, { onConflict: "id" });
  if (error) throw new Error(`usuarios upsert: ${error.message}`);
  resumen.usuarios++;
}

async function upsertVulnerabilidad(row: {
  usuario_id: string;   // columna real es usuario_id (no paciente_id)
  jefa_hogar: boolean;
  de_provincia: boolean;
  tiene_discapacidad: boolean;
  habla_quechua: boolean;
}) {
  // No hay unique constraint en usuario_id → delete-then-insert
  await supabase.from("perfil_vulnerabilidad").delete().eq("usuario_id", row.usuario_id);
  const { error } = await supabase.from("perfil_vulnerabilidad").insert(row);
  if (error) throw new Error(`perfil_vulnerabilidad insert: ${error.message}`);
  resumen.perfil_vulnerabilidad++;
}

async function resetProceso(
  pacienteId: string,
  pasoIds: string[],
  estados: ("completado" | "en_curso" | "pendiente")[]
) {
  await supabase.from("proceso_paciente").delete().eq("paciente_id", pacienteId);
  const rows = pasoIds.map((paso_id, i) => ({
    paciente_id: pacienteId,
    paso_id,
    estado: estados[i],
  }));
  const { error } = await supabase.from("proceso_paciente").insert(rows);
  if (error) throw new Error(`proceso_paciente insert: ${error.message}`);
  resumen.proceso_paciente += rows.length;
}

async function resetCitas(
  pacienteId: string,
  citas: Array<{
    servicio: string;
    fecha: string;
    hora: string | null;
    piso: string | null;
    estado: string;
    que_llevar?: string | null;
    paso_id?: string | null;
  }>
) {
  await supabase.from("citas").delete().eq("paciente_id", pacienteId);
  if (citas.length === 0) return;
  const rows = citas.map((c) => ({ paciente_id: pacienteId, ...c }));
  const { error } = await supabase.from("citas").insert(rows);
  if (error) throw new Error(`citas insert: ${error.message}`);
  resumen.citas += rows.length;
}

async function resetDocumentos(
  pacienteId: string,
  docs: Array<{
    nombre: string;
    estado: string;
    url: string;
    paso_id?: string | null;
    comentario_admin?: string | null;
  }>
) {
  await supabase.from("documentos").delete().eq("paciente_id", pacienteId);
  if (docs.length === 0) return;
  const rows = docs.map((d) => ({ paciente_id: pacienteId, ...d }));
  const { error } = await supabase.from("documentos").insert(rows);
  if (error) throw new Error(`documentos insert: ${error.message}`);
  resumen.documentos += rows.length;
}

async function upsertNota(pacienteId: string, contenido: string) {
  await supabase.from("notas_internas").delete().eq("paciente_id", pacienteId);
  const { error } = await supabase
    .from("notas_internas")
    .insert({ paciente_id: pacienteId, contenido });
  if (error) throw new Error(`notas_internas insert: ${error.message}`);
  resumen.notas_internas++;
}

// ─── 1. PASOS (tabla maestra compartida) ─────────────────────────────────────

async function seedPasos(): Promise<Record<number, string>> {
  console.log("\n📋  Pasos del proceso diagnóstico...");

  // La tabla tiene: nombre, descripcion, orden, tiempo_estimado, que_llevar
  const pasosSospecha = [
    {
      orden: 0,
      nombre: "Preparación",
      descripcion: "Documentos necesarios antes de llegar al INEN",
      tiempo_estimado: "1-2 días",
      que_llevar: "DNI original, hoja de referencia del centro de salud, documentos clínicos previos (análisis, ecografías)",
    },
    {
      orden: 1,
      nombre: "Admisión y evaluación",
      descripcion: "Evaluación de criterios de admisión al INEN",
      tiempo_estimado: "1 día",
      que_llevar: "Todos los documentos del paso anterior",
    },
    {
      orden: 2,
      nombre: "Apertura de HC y asignación de cita",
      descripcion: "Se abre tu historia clínica y se asigna tu primera cita con especialista",
      tiempo_estimado: "3-7 días hábiles",
      que_llevar: "DNI, número de historia clínica que te entregarán",
    },
    {
      orden: 3,
      nombre: "Primera consulta con especialista",
      descripcion: "Evaluación inicial con el oncólogo. Planificará tus exámenes de apoyo.",
      tiempo_estimado: "1 día (consulta)",
      que_llevar: "Historia clínica, DNI, SIS, todos los estudios previos",
    },
    {
      orden: 4,
      nombre: "Exámenes de apoyo diagnóstico",
      descripcion: "Mamografía, ecografía, colposcopía o biopsia según tu caso",
      tiempo_estimado: "1-3 semanas",
      que_llevar: "Orden médica del especialista, DNI",
    },
    {
      orden: 5,
      nombre: "Evaluación diagnóstica y resultado",
      descripcion: "El médico te entrega el resultado final e inicia el tratamiento",
      tiempo_estimado: "1 semana",
      que_llevar: "Resultados de todos los exámenes realizados",
    },
  ];

  const pasoIdsByOrden: Record<number, string> = {};

  for (const paso of pasosSospecha) {
    const { data: existing } = await supabase
      .from("pasos")
      .select("id, orden")
      .eq("nombre", paso.nombre)
      .maybeSingle();

    if (existing) {
      pasoIdsByOrden[existing.orden] = existing.id;
      log(`↩  paso ${paso.orden} ya existe → ${existing.id}`);
      continue;
    }

    const { data, error } = await supabase.from("pasos").insert(paso).select("id").single();
    if (error) throw new Error(`pasos insert orden=${paso.orden}: ${error.message}`);
    pasoIdsByOrden[paso.orden] = data.id;
    resumen.pasos++;
    log(`✅  paso ${paso.orden}: "${paso.nombre}" → ${data.id}`);
  }

  return pasoIdsByOrden;
}

// ─── 2. DOCTORES demo ────────────────────────────────────────────────────────

async function seedDoctores() {
  console.log("\n👨‍⚕️  Doctores...");

  // columna `activo` (boolean), NO `estado` (texto) — bug en AgregarDoctor.tsx
  const doctores = [
    { nombre: "Dra. Patricia Vargas Llanos", especialidad: "Oncología Médica - Mama",      telefono: "(01) 201-6000", email: "pvargas@inen.gob.pe",  activo: true },
    { nombre: "Dr. Roberto Sánchez Quispe",  especialidad: "Cirugía Oncológica",           telefono: "(01) 201-6000", email: "rsanchez@inen.gob.pe", activo: true },
    { nombre: "Dra. Lucía Mendoza Farfán",   especialidad: "Radiodiagnóstico - Imágenes",  telefono: "(01) 201-6000", email: "lmendoza@inen.gob.pe", activo: true },
    { nombre: "Dr. Carlos Huamán Torres",    especialidad: "Oncología Médica - Cérvix",    telefono: "(01) 201-6000", email: "chuaman@inen.gob.pe",  activo: true },
  ];

  for (const doctor of doctores) {
    const { data: existing } = await supabase
      .from("doctores")
      .select("id")
      .eq("email", doctor.email)
      .maybeSingle();

    if (existing) { log(`↩  ${doctor.nombre} ya existe`); continue; }

    const { error } = await supabase.from("doctores").insert(doctor);
    if (error) throw new Error(`doctores insert: ${error.message}`);
    resumen.doctores++;
    log(`✅  ${doctor.nombre}`);
  }
}

// ─── 3. PACIENTE DEMO PRINCIPAL: Rosa Quispe Huamán ─────────────────────────

async function seedRosa(pasoIds: Record<number, string>): Promise<string> {
  console.log("\n🌹  Paciente demo: Rosa Quispe Huamán...");

  // 3a. Auth user
  let userId: string;
  const { data: existingList } = await supabase.auth.admin.listUsers();
  const existingAuthUser = (existingList?.users ?? []).find(
    (u: { id: string; email?: string }) => u.email === DEMO_EMAIL
  );

  if (existingAuthUser) {
    userId = existingAuthUser.id;
    log(`↩  Auth user ya existe → ${userId}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { nombre: "Rosa Quispe Huamán" },
    });
    if (error) throw new Error(`auth.createUser: ${error.message}`);
    userId = data.user.id;
    resumen.auth_users++;
    log(`✅  Auth user creado → ${userId}`);
  }

  // 3b. Row en tabla usuarios
  // Nota: tipo_paciente NO existe en la DB — el ProcesoPage usa fallback "sospecha"
  await upsertUsuario({
    id: userId,
    dni: DEMO_DNI,
    nombre: "Rosa Quispe Huamán",
    telefono: "987654321",
    email: DEMO_EMAIL,
    rol: "paciente",
    idioma: "qu",
  });
  log("✅  usuarios (idioma: qu)");

  // 3c. Perfil de vulnerabilidad → Alta prioridad
  await upsertVulnerabilidad({
    usuario_id: userId,
    jefa_hogar: true,
    de_provincia: true,
    tiene_discapacidad: false,
    habla_quechua: true,
  });
  log("✅  perfil_vulnerabilidad (Alta prioridad: de_provincia + jefa_hogar)");

  // 3d. Proceso sospecha: 6 pasos, en curso en paso 3
  await resetProceso(
    userId,
    [pasoIds[0], pasoIds[1], pasoIds[2], pasoIds[3], pasoIds[4], pasoIds[5]],
    ["completado", "completado", "completado", "en_curso", "pendiente", "pendiente"]
  );
  log("✅  proceso_paciente (6 pasos, en_curso: Paso 3 — Primera consulta)");

  // 3e. Citas (columna que_llevar en lugar de notas)
  await resetCitas(userId, [
    {
      servicio: "Consulta con especialista - Mama",
      fecha: "2026-05-20",
      hora: "09:00",
      piso: "Piso 3 - Oncología Médica",
      estado: "completada",
      paso_id: pasoIds[3],
    },
    {
      servicio: "Consulta con especialista - Mama",
      fecha: "2026-06-18",
      hora: "10:30",
      piso: "Piso 3 - Oncología Médica",
      estado: "confirmada",
      que_llevar: "Historia clínica, DNI, SIS, resultados de análisis de sangre",
      paso_id: pasoIds[3],
    },
    {
      servicio: "Ecografía mamaria",
      fecha: "2026-07-05",
      hora: "08:00",
      piso: "Piso 2 - Diagnóstico por Imágenes",
      estado: "programada",   // enum real: programada | confirmada | completada
      que_llevar: "Orden médica del especialista, DNI",
      paso_id: pasoIds[4],
    },
  ]);
  log("✅  citas (3: completada, confirmada, solicitada)");

  // 3f. Documentos (sin columnas tipo/descripcion, comentario → comentario_admin)
  const URL_BASE = "https://demo.inen.pe/seed/placeholder";
  await resetDocumentos(userId, [
    {
      nombre: "DNI escaneado.pdf",
      estado: "aprobado",
      url: `${URL_BASE}/dni_rosa.pdf`,
      paso_id: pasoIds[0],
    },
    {
      nombre: "Hoja de referencia del hospital.pdf",
      estado: "aprobado",
      url: `${URL_BASE}/referencia_rosa.pdf`,
      paso_id: pasoIds[0],
    },
    {
      nombre: "Resultados de análisis de sangre.pdf",
      estado: "en_revision",
      url: `${URL_BASE}/analisis_rosa.pdf`,
      paso_id: pasoIds[3],
    },
    {
      nombre: "Ecografía previa (2024).jpg",
      estado: "rechazado",
      url: `${URL_BASE}/eco_rosa.jpg`,
      paso_id: pasoIds[4],
      comentario_admin: "La imagen está borrosa y no es legible. Por favor sube una copia más clara o el PDF original.",
    },
  ]);
  log("✅  documentos (4: aprobado×2, en_revision, rechazado)");

  return userId;
}

// ─── 4. PACIENTES EXTRA ───────────────────────────────────────────────────────

async function seedPacientesExtra(pasoIds: Record<number, string>) {
  console.log("\n👥  Pacientes extra para el panel admin...");

  // ── María Torres Ccoa — diagnosticado-like, Alta prioridad, tratamiento activo ──
  await upsertUsuario({
    id: ID_MARIA,
    dni: "12345678",
    nombre: "María Torres Ccoa",
    telefono: "912345678",
    email: null,
    rol: "paciente",
    idioma: "es",
  });
  await upsertVulnerabilidad({
    usuario_id: ID_MARIA,
    jefa_hogar: true,
    de_provincia: true,
    tiene_discapacidad: false,
    habla_quechua: false,
  });
  // 4 pasos (como si fuera diagnosticado): en_curso en paso 1
  await resetProceso(
    ID_MARIA,
    [pasoIds[0], pasoIds[1], pasoIds[2], pasoIds[3]],
    ["completado", "en_curso", "pendiente", "pendiente"]
  );
  await resetCitas(ID_MARIA, [
    {
      servicio: "Quimioterapia",
      fecha: "2026-06-20",
      hora: "08:00",
      piso: "Piso 4 - Quimioterapia Ambulatoria",
      estado: "confirmada",
      que_llevar: "Resultados de último hemograma, SIS, DNI",
    },
  ]);
  await upsertNota(
    ID_MARIA,
    "Paciente con dificultades para trasladarse desde Ayacucho. Coordinar con trabajo social para apoyo de viáticos. Tolera bien el primer ciclo de quimioterapia."
  );
  log("✅  María Torres Ccoa (Alta prioridad, en tratamiento)");

  // ── Carmen Flores Ríos — preventivo, sin prioridad, proceso completado ──
  await upsertUsuario({
    id: ID_CARMEN,
    dni: "23456789",
    nombre: "Carmen Flores Ríos",
    telefono: "923456789",
    email: "cflores@gmail.com",
    rol: "paciente",
    idioma: "es",
  });
  await upsertVulnerabilidad({
    usuario_id: ID_CARMEN,
    jefa_hogar: false,
    de_provincia: false,
    tiene_discapacidad: false,
    habla_quechua: false,
  });
  // 3 pasos completados
  await resetProceso(
    ID_CARMEN,
    [pasoIds[0], pasoIds[1], pasoIds[2]],
    ["completado", "completado", "completado"]
  );
  await resetCitas(ID_CARMEN, [
    {
      servicio: "Mamografía",
      fecha: "2026-04-15",
      hora: "09:30",
      piso: "Piso 2 - Diagnóstico por Imágenes",
      estado: "completada",
    },
  ]);
  log("✅  Carmen Flores Ríos (sin prioridad, proceso completado)");

  // ── Julia Mamani Quispe — sospecha, recién llegó, paso 0 en_curso ──
  await upsertUsuario({
    id: ID_JULIA,
    dni: "34567890",
    nombre: "Julia Mamani Quispe",
    telefono: "934567890",
    email: null,
    rol: "paciente",
    idioma: "qu",
  });
  await upsertVulnerabilidad({
    usuario_id: ID_JULIA,
    jefa_hogar: false,
    de_provincia: true,
    tiene_discapacidad: false,
    habla_quechua: true,
  });
  await resetProceso(
    ID_JULIA,
    [pasoIds[0], pasoIds[1], pasoIds[2], pasoIds[3], pasoIds[4], pasoIds[5]],
    ["en_curso", "pendiente", "pendiente", "pendiente", "pendiente", "pendiente"]
  );
  await resetCitas(ID_JULIA, []);
  log("✅  Julia Mamani Quispe (Media prioridad, recién llegó)");

  // ── Ana Lucía Díaz — diagnóstico confirmado, control y seguimiento ──
  await upsertUsuario({
    id: ID_ANA,
    dni: "45678901",
    nombre: "Ana Lucía Díaz",
    telefono: "945678901",
    email: "anadiaz@hotmail.com",
    rol: "paciente",
    idioma: "es",
  });
  await upsertVulnerabilidad({
    usuario_id: ID_ANA,
    jefa_hogar: false,
    de_provincia: false,
    tiene_discapacidad: false,
    habla_quechua: false,
  });
  await resetProceso(
    ID_ANA,
    [pasoIds[0], pasoIds[1], pasoIds[2], pasoIds[3]],
    ["completado", "completado", "en_curso", "pendiente"]
  );
  await resetCitas(ID_ANA, [
    {
      servicio: "Control y seguimiento - Oncología",
      fecha: "2026-07-10",
      hora: "11:00",
      piso: "Piso 3 - Oncología Médica",
      estado: "programada",
    },
  ]);
  log("✅  Ana Lucía Díaz (sin prioridad, control y seguimiento)");
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀  OncoRuta — Seed de datos demo");
  console.log(`    Supabase: ${SUPABASE_URL}`);
  console.log("─".repeat(50));

  try {
    const pasoIds = await seedPasos();
    await seedDoctores();
    await seedRosa(pasoIds);
    await seedPacientesExtra(pasoIds);

    console.log("\n" + "─".repeat(50));
    console.log("✅  Seed completado. Resumen:\n");
    console.log(`   Auth users creados     : ${resumen.auth_users}`);
    console.log(`   Filas en usuarios      : ${resumen.usuarios}`);
    console.log(`   Perfil vulnerabilidad  : ${resumen.perfil_vulnerabilidad}`);
    console.log(`   Pasos insertados       : ${resumen.pasos}`);
    console.log(`   proceso_paciente rows  : ${resumen.proceso_paciente}`);
    console.log(`   Citas                  : ${resumen.citas}`);
    console.log(`   Documentos             : ${resumen.documentos}`);
    console.log(`   Notas internas         : ${resumen.notas_internas}`);
    console.log(`   Doctores               : ${resumen.doctores}`);
    console.log("\n🔑  Login demo:");
    console.log(`    Email    : ${DEMO_EMAIL}`);
    console.log(`    Password : ${DEMO_PASSWORD}`);
    console.log("\n⚠️   Bugs de schema detectados (ver comentarios en seed.ts):");
    console.log("    - usuarios.tipo_paciente no existe → ProcesoPage siempre muestra ruta 'sospecha'");
    console.log("    - doctores.estado no existe → AgregarDoctor.tsx falla al guardar");
    console.log("    - documentos.tipo y .descripcion no existen → SubirDocumento los ignora");
    console.log("    - citas.notas no existe → SolicitarCita usa que_llevar o los ignora");
    console.log("");
  } catch (err) {
    console.error("\n❌  Error durante el seed:");
    console.error(err);
    process.exit(1);
  }
}

main();
