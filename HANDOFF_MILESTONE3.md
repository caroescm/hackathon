# Handoff — Milestone 3: Pantallas de Paciente

## Contexto del Proyecto

Proyecto para Hackatón Transformagob 2026 / INEN (Instituto Nacional de Enfermedades Neoplásicas, Perú).
Es una **extensión del portal existente de pacientes del INEN** — no un sistema nuevo.
Acompaña a mujeres con diagnóstico de cáncer de mama/cérvix en su proceso post-diagnóstico.

## Tech Stack

- **Next.js 14** con App Router + TypeScript
- **Tailwind CSS** (colores custom definidos abajo)
- **Supabase** (PostgreSQL + Auth + Storage)
- Proyecto en: `oncoruta/` dentro del workspace

## Colores Tailwind (tailwind.config.ts)

```
primary: #1a56db
primary-dark: #1e429f
primary-light: #e8f0fe
success: #0e9f6e
warning: #c27803
danger: #e02424
muted: #6b7280
foreground: #111928
border: #e5e7eb
background: #f9fafb
sidebar: #ffffff
```

## Estructura de archivos relevante

```
oncoruta/
├── app/
│   └── (paciente)/
│       ├── layout.tsx              ← lee usuarios.nombre, pasa a Sidebar
│       ├── dashboard/page.tsx      ← COMPLETO y funcional
│       ├── proceso/page.tsx        ← HARDCODED — issue M3-1
│       ├── documentos/page.tsx     ← HARDCODED — issue M3-2
│       ├── citas/page.tsx          ← HARDCODED — issue M3-3
│       └── informacion/page.tsx    ← ESTÁTICO — issue M3-4
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             ← acepta role y userName como props
│   │   └── TopBar.tsx
│   └── ui/
│       ├── Badge.tsx               ← variants: default | info | success | warning | danger
│       ├── Button.tsx
│       ├── Card.tsx                ← acepta title, description, children
│       └── Input.tsx
└── lib/
    └── supabase/
        ├── client.ts               ← createClient() para "use client"
        ├── server.ts               ← createClient() para Server Components
        └── types.ts
```

## Esquema de base de datos (Supabase / PostgreSQL)

### `usuarios`
| columna | tipo | notas |
|---|---|---|
| id | uuid | = auth.uid() |
| dni | text | único |
| nombre | text | nombre completo |
| telefono | text | |
| email | text | opcional |
| rol | text | 'paciente' \| 'familiar' \| 'admin' |
| idioma | text | 'es' \| 'qu' |

### `pasos` (datos de referencia, no editar)
| columna | tipo | notas |
|---|---|---|
| id | uuid | |
| nombre | text | ej: "Admisión y Registro" |
| descripcion | text | |
| orden | int | 1 al 5 |

Los 5 pasos reales del INEN:
1. Admisión y Registro
2. Evaluación Oncológica
3. Tratamiento
4. Seguimiento
5. Alta o Remisión

### `proceso_paciente`
| columna | tipo | notas |
|---|---|---|
| id | uuid | |
| paciente_id | uuid | FK → auth.uid() |
| paso_id | uuid | FK → pasos.id |
| estado | text | 'pendiente' \| 'en_curso' \| 'completado' |

FK definida: `proceso_paciente.paso_id → pasos.id`
Query correcta: `.from("proceso_paciente").select("id, estado, pasos(id, nombre, descripcion, orden)").eq("paciente_id", userId)`

### `documentos` (puede que no exista aún — ver nota al final)
| columna | tipo | notas |
|---|---|---|
| id | uuid | |
| paciente_id | uuid | FK → usuarios.id |
| paso_id | uuid | FK → pasos.id (a qué paso pertenece) |
| nombre | text | nombre del archivo |
| url | text | URL en Supabase Storage |
| estado | text | 'enviado' \| 'en_revision' \| 'aprobado' \| 'rechazado' |
| comentario | text | comentario de la asistenta social (nullable) |
| created_at | timestamp | |

### `citas` (puede que no exista aún — ver nota al final)
| columna | tipo | notas |
|---|---|---|
| id | uuid | |
| paciente_id | uuid | FK → usuarios.id |
| paso_id | uuid | FK → pasos.id |
| tipo | text | ej: "Oncología Médica" |
| fecha | date | |
| hora | time | |
| lugar | text | |
| medico | text | nullable |
| estado | text | 'pendiente' \| 'confirmada' \| 'completada' \| 'cancelada' |
| notas | text | nullable |

> **NOTA IMPORTANTE**: Si `documentos` o `citas` no existen en Supabase, no las crees desde el código. Avisa que se necesita el SQL para crearlas y el usuario las crea manualmente. Lo mismo para políticas RLS.

## Convenciones del proyecto

- Todas las páginas en `(paciente)/` son **Server Components** (async, usan `createClient` de `server.ts`)
- Si una página necesita interactividad (upload, modales), crear subcomponentes `"use client"` dentro de la misma carpeta
- **Nunca hardcodear datos** que deberían venir de Supabase
- Si una query falla o devuelve vacío, mostrar estado vacío elegante (no error genérico)
- Usar siempre los componentes UI existentes: `Card`, `Badge`, `Button`, `Input`
- El SQL para crear tablas o políticas RLS se entrega **siempre por separado** — no se ejecuta desde el código

---

## MILESTONE 3 — Issues

---

### Issue M3-1: Mi Proceso (`/proceso/page.tsx`)

**Estado actual**: hardcodeado con 6 etapas incorrectas (usa `EtapaProceso` = diagnostico/cirugia/quimio...) que no corresponden a los pasos reales del INEN.

**Lo que debe hacer**:
- Leer `proceso_paciente` JOIN `pasos` del usuario autenticado, ordenado por `pasos.orden`
- Mostrar un timeline vertical con los 5 pasos reales
- Cada paso muestra: número/check, nombre, descripción, badge de estado
- El paso `en_curso` tiene un indicador visual destacado (ring, color primario)
- Los pasos `completado` muestran check verde
- Los pasos `pendiente` están en gris

**Sub-issues**:
- [ ] Reemplazar array hardcodeado por query a Supabase
- [ ] Mostrar descripcion del paso (viene de `pasos.descripcion`)
- [ ] Indicador visual correcto por estado: completado=verde check, en_curso=azul con ring, pendiente=gris
- [ ] Estado vacío si no hay proceso (texto: "Tu proceso aún no ha sido configurado. Contacta a la asistenta social.")

**Query a usar**:
```ts
const { data } = await supabase
  .from("proceso_paciente")
  .select("id, estado, pasos(id, nombre, descripcion, orden)")
  .eq("paciente_id", userId)
  .order("orden", { referencedTable: "pasos", ascending: true });
```

---

### Issue M3-2: Mis Documentos (`/documentos/page.tsx`)

**Estado actual**: lista hardcodeada con 5 documentos ficticios. No hay upload real.

**Lo que debe hacer**:
- Leer documentos reales desde tabla `documentos` donde `paciente_id = auth.uid()`
- Mostrar estado de cada documento con badge: Enviado / En revisión / Aprobado / Rechazado
- Si estado es `rechazado`, mostrar el campo `comentario` en rojo debajo del documento
- Botón "Subir documento" que abre un modal/formulario para subir archivo
- El upload va a Supabase Storage bucket `documentos`, path: `{userId}/{filename}`
- Al subir, insertar fila en tabla `documentos` con estado `'enviado'`
- Si la tabla `documentos` no existe en Supabase, avisar con el SQL necesario

**Sub-issues**:
- [ ] Query real a tabla `documentos`
- [ ] Badge de estado: enviado=info, en_revision=warning, aprobado=success, rechazado=danger
- [ ] Mostrar `comentario` si estado es `rechazado`
- [ ] Componente cliente `SubirDocumentoModal.tsx` con input de archivo + selector de paso
- [ ] Upload a Supabase Storage + insert en tabla `documentos`
- [ ] Estado vacío: "Aún no has subido documentos."

**SQL necesario** (entregar al usuario para que lo corra):
```sql
CREATE TABLE IF NOT EXISTS documentos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  paso_id uuid REFERENCES pasos(id),
  nombre text NOT NULL,
  url text NOT NULL,
  estado text DEFAULT 'enviado' CHECK (estado IN ('enviado','en_revision','aprobado','rechazado')),
  comentario text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "paciente ve sus documentos"
ON documentos FOR SELECT TO authenticated
USING (auth.uid() = paciente_id);

CREATE POLICY "paciente sube sus documentos"
ON documentos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = paciente_id);
```

---

### Issue M3-3: Mis Citas (`/citas/page.tsx`)

**Estado actual**: lista hardcodeada con 4 citas ficticias.

**Lo que debe hacer**:
- Leer citas reales desde tabla `citas` donde `paciente_id = auth.uid()`
- Separar en "Próximas citas" (pendiente/confirmada) y "Citas anteriores" (completada/cancelada)
- Mostrar: tipo, médico, fecha, hora, lugar, badge de estado
- Si no hay citas: "No tienes citas programadas. La asistenta social te asignará tu primera cita."
- Si la tabla `citas` no existe en Supabase, avisar con el SQL necesario

**Sub-issues**:
- [ ] Query real a tabla `citas`
- [ ] Separar próximas vs anteriores
- [ ] Badge por estado: confirmada=success, pendiente=warning, completada=default, cancelada=danger
- [ ] Estado vacío con mensaje orientador
- [ ] Ordenar próximas por fecha ASC, anteriores por fecha DESC

**SQL necesario** (entregar al usuario para que lo corra):
```sql
CREATE TABLE IF NOT EXISTS citas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  paso_id uuid REFERENCES pasos(id),
  tipo text NOT NULL,
  fecha date NOT NULL,
  hora time NOT NULL,
  lugar text,
  medico text,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','completada','cancelada')),
  notas text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "paciente ve sus citas"
ON citas FOR SELECT TO authenticated
USING (auth.uid() = paciente_id);
```

---

### Issue M3-4: Información (`/informacion/page.tsx`)

**Estado actual**: 4 secciones genéricas sobre cáncer de mama. No está conectada al proceso del paciente.

**Lo que debe hacer**:
- Mantener contenido estático (no necesita DB)
- Reorganizar en 5 secciones, una por paso del proceso INEN:
  1. **Admisión y Registro** — qué documentos traer, qué pasa ese día
  2. **Evaluación Oncológica** — qué esperar, qué exámenes se piden
  3. **Tratamiento** — tipos (cirugía, quimio, radio), qué es cada uno
  4. **Seguimiento** — frecuencia de controles, señales de alerta
  5. **Alta o Remisión** — qué significa, cuidados post-tratamiento
- Sección adicional fija: "Líneas de apoyo INEN" con teléfonos reales
- Acordeón o cards expandibles por sección
- Lenguaje simple, sin tecnicismos

**Sub-issues**:
- [ ] Reestructurar en 5 secciones por paso (contenido en español)
- [ ] Usar acordeón (expandir/colapsar) o cards con toggle — componente cliente
- [ ] Sección de contacto INEN al final: (01) 201-6000, ext. 2050 (Social), ext. 2070 (Psicología)
- [ ] Botón flotante o banner de WhatsApp en la parte inferior de la página

---

## Cómo trabajar estos issues

Cada issue es independiente y genera su propio PR. Orden recomendado:
1. M3-1 (Proceso) — no necesita tablas nuevas
2. M3-4 (Información) — no necesita tablas nuevas  
3. M3-2 (Documentos) — necesita crear tabla + Storage bucket
4. M3-3 (Citas) — necesita crear tabla

Para M3-2 y M3-3: el SQL de creación de tablas se entrega al usuario para que lo corra manualmente en Supabase. No se crea desde el código.
