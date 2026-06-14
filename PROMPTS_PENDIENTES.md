# Prompts para Claude Code — OncoRuta Mujer Inteligente

---

## 10. Completar traducciones ES/QU pendientes

### Contexto
El sistema de idioma (IdiomaContext + translations.ts) ya está implementado y funciona. Estos archivos aún tienen strings hardcodeados en español que no responden al toggle ES/QU.

### Archivo: `components/proceso/RoadmapPasos.tsx`

El componente NO importa `useIdioma`. Agrégalo y reemplaza los badges de estado hardcodeados:

```tsx
// Agregar import
import { useIdioma } from "@/lib/i18n/IdiomaContext";

// Dentro del componente, antes del return:
const { t } = useIdioma();

// Reemplazar línea hardcodeada:
// ANTES:
{isDone ? "Completado" : isActive ? "En curso" : "Pendiente"}
// DESPUÉS:
{isDone ? t.completado : isActive ? t.enCurso : t.pendiente}
```

---

### Archivo: `app/(paciente)/citas/CitasCliente.tsx`

1. Agregar `idioma` al destructure: `const { t, idioma } = useIdioma();`

2. Reemplazar la función `estadoLabel`:
```tsx
function estadoLabel(estado: string) {
  if (estado === "solicitada") return idioma === "es" ? "Pendiente de confirmación" : "Suyasqa";
  if (estado === "confirmada") return idioma === "es" ? "Confirmada" : "Allinmi";
  if (estado === "programada") return idioma === "es" ? "Programada" : "Churasqa";
  if (estado === "completada") return t.completado;
  return estado.charAt(0).toUpperCase() + estado.slice(1);
}
```

3. Reemplazar las 2 cards superiores (título, descripción, botón "Ingresar"):
```tsx
// Card izquierda
title: idioma === "es" ? "SOLICITUD DE CITAS" : "TUPANAKUY MAÑAY"
desc: idioma === "es"
  ? "Solicita tu cita según la disponibilidad del servicio o departamento correspondiente."
  : "Tupanakuykita mañay hampiq wasimanta."
// Card derecha
title: idioma === "es" ? "CONSULTA TU CITA" : "TUPANAKUYNIYKITA MASK'AY"
desc: idioma === "es"
  ? "¿Quieres saber cuándo es tu próxima cita? Haz clic aquí y revisa los detalles al instante."
  : "Qatiq tupanakuyniykita yachanki munajtinki? Kaypim tarinki."
// Botón Ingresar (ambas cards)
{idioma === "es" ? "Ingresar" : "Yaykuy"}
```

4. Reemplazar "Por confirmar":
```tsx
{cita.fecha ? formatFecha(cita.fecha) : (idioma === "es" ? "Por confirmar" : "Manaranmi")}
{cita.hora ?? (idioma === "es" ? "Por confirmar" : "Manaranmi")}
```

5. Reemplazar contador de citas:
```tsx
description={proximas.length > 0
  ? idioma === "es"
    ? `${proximas.length} cita${proximas.length !== 1 ? "s" : ""} programada${proximas.length !== 1 ? "s" : ""}`
    : `${proximas.length} tupanakuy`
  : undefined}
```

---

### Archivo: `components/citas/SolicitarCita.tsx`

1. Agregar imports y hook:
```tsx
import { useIdioma } from "@/lib/i18n/IdiomaContext";
// dentro del componente:
const { idioma } = useIdioma();
```

2. Reemplazar TODOS los strings del modal con ternarios `idioma === "es" ? "..." : "..."`:

```tsx
// Título modal
idioma === "es" ? "Solicitar cita" : "Tupanakuy mañay"

// Instrucción
idioma === "es"
  ? "Indica el servicio y tu fecha preferida. El equipo del INEN revisará tu solicitud y te confirmará la cita."
  : "Hampiq wasipi imata munasqaykita nin. INEN-manta runakuna tupanakuykita nisunkiku."

// Label Servicio
idioma === "es" ? "Servicio" : "Hampiy ñan"

// Label Fecha preferida
idioma === "es" ? "Fecha preferida" : "Munasqa p'unchay"

// (Opcional)
idioma === "es" ? "(Opcional)" : "(Mana wakichisqachu)"

// Nota debajo de fecha
idioma === "es"
  ? "Esta es tu preferencia — la fecha final la confirma el INEN."
  : "Kaymi munasqayki — p'unchay runan INEN-mi nisunki."

// Label Motivo
idioma === "es" ? "Motivo o indicaciones adicionales" : "Imapaqmi o yapa willay"

// Placeholder textarea
idioma === "es"
  ? "Ej: Me derivaron para segunda opinión oncológica"
  : "Ej: Qhawachiwanku onqoyniymanta"

// Confirmación enviado
idioma === "es" ? "¡Solicitud enviada!" : "¡Mañakuyki kachasqaña!"
idioma === "es"
  ? "Tu solicitud fue enviada. El equipo del INEN te confirmará la cita."
  : "Mañakuyki kachasqaña. INEN-manta runakuna tupanakuykita nisunkiku."

// Botones
idioma === "es" ? "Cancelar" : "Saqiy"
idioma === "es" ? "Enviar solicitud" : "Kachay"
idioma === "es" ? "Cerrar" : "Wichqay"

// Error sesión
idioma === "es" ? "Sesión expirada. Recarga la página." : "Sesión tukun. Kutichimuytaq."
```

---

### Archivo: `components/documentos/SubirDocumento.tsx`

1. Agregar imports y hook:
```tsx
import { useIdioma } from "@/lib/i18n/IdiomaContext";
const { idioma } = useIdioma();
```

2. Traducir `TIPOS_DOCUMENTO` — moverlo DENTRO del componente y condicionarlo:
```tsx
const TIPOS_DOCUMENTO = idioma === "es"
  ? [
      { value: "historia_clinica", label: "Historia clínica" },
      { value: "resultado_examen", label: "Resultado de examen" },
      { value: "referencia", label: "Hoja de referencia" },
      { value: "otro", label: "Otro" },
    ]
  : [
      { value: "historia_clinica", label: "Kawsay qillqa" },
      { value: "resultado_examen", label: "Llanachiy tarisqa" },
      { value: "referencia", label: "Qillqa kachasqa" },
      { value: "otro", label: "Huk" },
    ];
```

3. Reemplazar strings del modal:
```tsx
// Título modal
idioma === "es" ? "Subir documento" : "Qillqa apachiy"

// Label Tipo
idioma === "es" ? "Tipo de documento" : "Qillqa rikch'aq"

// Label Archivo
idioma === "es" ? "Archivo" : "Qillqa"

// Zona drag
idioma === "es" ? "Haz clic para seleccionar un archivo" : "Kayta tocay qillqata akllanapaq"
idioma === "es" ? `PDF, JPG, PNG · Máx. ${MAX_SIZE_MB} MB` : `PDF, JPG, PNG · Aswan ${MAX_SIZE_MB} MB`

// Label Descripción
idioma === "es" ? "Descripción o notas" : "Willakuy o qillqay"

// Placeholder textarea
idioma === "es"
  ? "Ej: Resultado de mamografía del 10 de junio"
  : "Ej: Mamografía tarisqan huniy killapi"

// Confirmación
idioma === "es" ? "¡Documento subido correctamente!" : "¡Qillqa apachisqaña!"
idioma === "es"
  ? "El equipo del INEN revisará tu documento."
  : "INEN-manta runakuna qillqaykita qhawankiku."

// Botones
idioma === "es" ? "Cancelar" : "Saqiy"
idioma === "es" ? "Subir" : "Apachiy"
idioma === "es" ? "Cerrar" : "Wichqay"

// Errores validación
idioma === "es" ? "Selecciona un archivo." : "Qillqata akllayuqtinki."
idioma === "es" ? "Solo se aceptan archivos PDF, JPG o PNG." : "PDF, JPG o PNG rillachu."
idioma === "es"
  ? `El archivo no puede superar ${MAX_SIZE_MB} MB.`
  : `Qillqa ${MAX_SIZE_MB} MB aswan kanmanchu.`
```

---

### Archivo: `app/(paciente)/proceso/ProcesoCliente.tsx`

Cambiar los objetos hardcodeados a condicionales según `idioma`:

```tsx
// TIPO_BADGE labels — reemplazar el objeto con una función o condicional dentro del componente:
const tipoBadgeLabel: Record<TipoPaciente, string> = idioma === "es"
  ? { preventivo: "Chequeo preventivo", sospecha: "Con sospecha", diagnosticado: "Diagnóstico confirmado" }
  : { preventivo: "Qhawariy", sospecha: "Sospecha nisqa", diagnosticado: "Diagnosticasqa" };

const tipoSubtitle: Record<TipoPaciente, string> = idioma === "es"
  ? {
      preventivo:    "Seguimiento de tu proceso de chequeo preventivo",
      sospecha:      "Seguimiento de tu proceso de evaluación en el INEN",
      diagnosticado: "Seguimiento de tu proceso de tratamiento oncológico",
    }
  : {
      preventivo:    "Qhawarisqa ñanniykita katiy",
      sospecha:      "INEN-pi taripay ñanniykita katiy",
      diagnosticado: "Hampiy ñanniykita katiy",
    };

// En el JSX, reemplazar badge.label y TIPO_SUBTITLE[tipoPaciente] por:
{tipoBadgeLabel[tipoPaciente]}
{idioma === "qu" ? t.subtitleRoadmap : tipoSubtitle[tipoPaciente]}
```

---

### Archivo: `app/(paciente)/informacion/InformacionAcordeon.tsx`

El contenido interno (Cat1–Cat5, PASOS_PROCESO, FAQS) es muy extenso para traducir en línea. Hacer lo siguiente:

1. Mover `PASOS_PROCESO`, `FAQS`, y los componentes `Cat1Content` a `Cat6Content` DENTRO del componente `InformacionAcordeon`, o pasarles `idioma` como prop.

2. Para `PASOS_PROCESO`, condicionarlo:
```tsx
const PASOS_PROCESO = idioma === "es"
  ? [
      { n: 1, label: "Preparación" }, { n: 2, label: "Registro" },
      { n: 3, label: "Consulta" },    { n: 4, label: "Exámenes" },
      { n: 5, label: "Resultado" },
    ]
  : [
      { n: 1, label: "Allichakuy" }, { n: 2, label: "Yaykuy" },
      { n: 3, label: "Tapukuy" },    { n: 4, label: "Llanachiy" },
      { n: 5, label: "Tariy" },
    ];
```

3. Para los `CatNContent` y `FAQS`: dado el volumen de texto, añadir al inicio de cada bloque de texto un wrapper condicional simple. Ejemplo para Cat1Content:
```tsx
const Cat1Content = ({ idioma }: { idioma: string }) => (
  <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
    <MiniTimeline idioma={idioma} />
    {idioma === "es" ? (
      <>
        <p>Antes de tu primera visita al INEN...</p>
        {/* resto del texto ES */}
      </>
    ) : (
      <>
        <p>INEN-man ñawpaq hamunankipaq, qillqaykikunata tantachiy: DNI, qillqa kachasqa hampiq wasimanta, llanachiy tarisqaykuna.</p>
        <p>Chayaptinki, yaykuyman rinki. Runakuna qillqaykikunata qhawanku. Allinmi kaptinki, kawsay qillqaykita kichanku, tapukuyniykit nisunkitaqmi.</p>
        <p>Ñawpaq tapukuykipi, hampiqmi qhawasunki, imatam llanachisqayki nisunki — mamografía, ecografía, colposcopía icha biopsia kanman. Tarisqakuna 1–4 simanamanta sayaykamunqa.</p>
        <p>Tukuypitaq, hampiqmi waqyasunki tarisqaykita willanaykipaq. Unquy kasqanta tariptinku, chay p'unchayllapitaqmi hampiy ñanniykita nisunkiku.</p>
      </>
    )}
  </div>
);
```

Repetir el mismo patrón para Cat2–Cat5 usando las traducciones del archivo `translations.ts` cuando existan, o traducción directa al quechua chanka del texto español.

Para las FAQS (Cat6), dado el volumen, es aceptable mostrar solo las 3 preguntas más críticas en quechua y el resto en español, indicando con un badge "Próximamente en quechua":
```tsx
const FAQS_QU = [
  { q: "¿INEN-pi atinchu mana pagaspa?", a: "SIS kasqaykiwan mana pagasqachu kanki. Mana seguruyki kaptinqa, Trabajo Social-pi tapukuy — yanapasunkiku." },
  { q: "¿38°C aswan rupaptiy, ima runayman rinay?", a: "Usqhaym INEN-pi emergencias-man ri. (01) 201-6000 waqyay." },
  { q: "¿Chukcha urmaptinmi kutimunqachu?", a: "Arí — hampiy tukuptinki, 4–6 simanamanta kutimunqa." },
];
```

---

## 11. Chatbot con elección de idioma al inicio

### Contexto
El chatbot usa Groq (llama-3.1-8b-instant) con un system prompt en español. Se quiere que al abrir el chat por primera vez, el bot ofrezca la opción de responder en español o quechua.

### Cambios en `components/chat/ChatBot.tsx`

1. Agregar estado para idioma del chat:
```tsx
const [chatIdioma, setChatIdioma] = useState<"es" | "qu" | null>(null);
```

2. El mensaje inicial ya NO es el de bienvenida — es una pregunta de elección de idioma:
```tsx
const mensajeEleccion: Message = {
  role: "assistant",
  content: "Hola 💙 ¿En qué idioma prefieres que te acompañe?\n\nRimaykullayki 💙 ¿Ima simipi rimanayki munawanki?\n\n🇵🇪 **Español** · **Quechua**",
};
```

3. Antes de mostrar el input de texto, si `chatIdioma === null`, mostrar dos botones en lugar del input:
```tsx
{chatIdioma === null ? (
  <div className="flex gap-2 px-3 py-2.5 bg-white border-t border-gray-200">
    <button
      onClick={() => {
        setChatIdioma("es");
        setMessages(prev => [...prev, { role: "assistant", content: t.chatBienvenida }]);
      }}
      className="flex-1 py-2 rounded-full border border-[#1a56db] text-[#1a56db] text-sm font-medium hover:bg-blue-50 transition-colors"
    >
      🇵🇪 Español
    </button>
    <button
      onClick={() => {
        setChatIdioma("qu");
        setMessages(prev => [...prev, { role: "assistant", content: "Allinllachu kashanki 💙 Imaynallataq yanapasunki atini? Tapukuyniykikunata nin — kaypim kachkani." }]);
      }}
      className="flex-1 py-2 rounded-full border border-[#1a56db] text-[#1a56db] text-sm font-medium hover:bg-blue-50 transition-colors"
    >
      Quechua
    </button>
  </div>
) : (
  // input normal existente
  <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-200">
    ...
  </div>
)}
```

4. Pasar `chatIdioma` a la API en el body del fetch:
```tsx
body: JSON.stringify({ message: text, chatIdioma }),
```

### Cambios en `app/api/chat/route.ts`

1. Leer `chatIdioma` del body:
```tsx
const { message, chatIdioma } = await req.json();
```

2. Agregar instrucción de idioma al final del `systemPrompt`:
```tsx
const idiomaInstruccion = chatIdioma === "qu"
  ? `\nIDIOMA: La paciente eligió quechua chanka. Responde SIEMPRE en quechua chanka (variante Ayacucho), con palabras simples. Si no sabes una palabra médica en quechua, usa la palabra en español con explicación en quechua. Ejemplo: "Quimioterapia nisqaqa — hampiy ñan onqoy wañuchiq oqarispa."`
  : `\nIDIOMA: Responde siempre en español.`;

const systemPromptFinal = systemPrompt + idiomaInstruccion;
```

3. Usar `systemPromptFinal` en lugar de `systemPrompt` en el llamado a Groq.

---

## 1. Sistema bilingüe Español / Quechua Chanka

### Contexto
El archivo `lib/i18n/translations.ts` ya existe con todas las traducciones ES/QU. Implementa el switch de idioma en toda la app.

### Tareas

**A) Crear el contexto de idioma**

Crea `lib/i18n/IdiomaContext.tsx`:

```tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import translations, { Idioma } from "./translations";

type IdiomaContextType = {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: typeof translations["es"];
};

const IdiomaContext = createContext<IdiomaContextType | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>("es");
  const t = translations[idioma];
  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma must be used inside IdiomaProvider");
  return ctx;
}
```

**B) Envolver layouts con el provider**

En todos los layouts que contienen `<Sidebar>` (paciente, admin), envuelve el children con `<IdiomaProvider>`.

**C) Agregar switch ES/QU al Sidebar**

Al final del Sidebar (antes del cerrar sesión), añade:

```tsx
const { idioma, setIdioma, t } = useIdioma();

// Botón toggle
<button
  onClick={() => setIdioma(idioma === "es" ? "qu" : "es")}
  className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-2 px-2 py-1 rounded-md hover:bg-gray-100"
>
  <span className="font-medium">{idioma === "es" ? "ES" : "QU"}</span>
  <span className="text-gray-300">|</span>
  <span>{idioma === "es" ? "Quechua" : "Español"}</span>
</button>
```

Y cuando el idioma es "qu", mostrar el disclaimer `t.disclaimerQuechua` en texto pequeño gris debajo del switch.

**D) Reemplazar strings en componentes**

Usa `useIdioma()` para reemplazar strings hardcodeados en:

- `components/layout/Sidebar.tsx` — labels de navegación
- `components/layout/TopBar.tsx` — no aplica (títulos vienen como props)
- `components/chat/ChatBot.tsx` — mensaje inicial (`t.chatBienvenida`), placeholder (`t.chatPlaceholder`), nombre del asistente (`t.chatNombreAsistente`), estado en línea (`t.chatEnLinea`)
- `app/(paciente)/dashboard/page.tsx` — saludo, stats cards labels
- `app/(paciente)/proceso/page.tsx` — título, subtítulo, nombres de pasos (si vienen de `pasos` table, mapear con `t.paso0Nombre` según `paso_id`)
- `app/(paciente)/documentos/page.tsx` — título, botón subir, mensaje sin docs
- `app/(paciente)/citas/page.tsx` — título, botón solicitar, mensajes vacíos
- `app/(paciente)/informacion/page.tsx` — título, subtítulo, categorías

**E) Nota sobre pasos en proceso**
Los nombres de pasos vienen de la DB (`pasos.nombre`). Si el idioma es "qu", sobreescribir con la traducción correspondiente del objeto `t` usando el `paso_id` como key lookup. Crear un mapeador:

```ts
const PASOS_QU: Record<number, { nombre: string; descripcion: string }> = {
  0: { nombre: t.paso0Nombre, descripcion: t.paso0Desc },
  1: { nombre: t.paso1Nombre, descripcion: t.paso1Desc },
  // etc.
};
```

---

## 2. Componente SubirDocumento (Client Component)

### Contexto
`app/(paciente)/documentos/page.tsx` tiene un botón estático "Subir documento" sin funcionalidad. Necesita un modal para subir archivos a Supabase Storage.

### Tarea
Crea `components/documentos/SubirDocumento.tsx` como Client Component:

```
- Botón que abre un modal/drawer
- Modal contiene:
  - Input tipo select: "Tipo de documento" (historia clínica, resultado de examen, referencia, otro)
  - File input que acepta PDF e imágenes (accept=".pdf,.jpg,.jpeg,.png")
  - Textarea opcional: "Descripción o notas"
  - Botón "Subir" y "Cancelar"
- Al subir:
  1. Sube el archivo a Supabase Storage en el bucket "documentos", ruta: `{user.id}/{timestamp}_{filename}`
  2. Inserta registro en tabla `documentos`:
     - paciente_id: user.id
     - tipo: valor del select
     - descripcion: texto del textarea
     - url: URL pública del archivo subido
     - estado: "enviado"
     - created_at: now()
  3. Muestra toast de éxito o error
  4. Cierra el modal y hace revalidate del path
- Usa createClient() de "@/lib/supabase/client"
- Usa router.refresh() para refrescar la lista
```

Integra el componente en `app/(paciente)/documentos/page.tsx` reemplazando el botón estático.

---

## 3. Componente SolicitarCita (Client Component)

### Contexto
`app/(paciente)/citas/page.tsx` necesita formulario para que la paciente solicite cita (estado="solicitada", luego admin la aprueba → "programada").

### Tarea
Crea `components/citas/SolicitarCita.tsx` como Client Component:

```
- Botón "Solicitar cita" que abre modal
- Modal contiene:
  - Select: "Servicio" (Oncología, Quimioterapia, Radioterapia, Cirugía, Diagnóstico por imágenes, Nutrición, Psicología Oncológica, Trabajo Social)
  - Input fecha preferida (type="date", min=tomorrow)
  - Textarea: "Motivo o indicaciones adicionales" (opcional)
  - Botón "Enviar solicitud" y "Cancelar"
- Al enviar:
  1. Inserta en tabla `citas`:
     - paciente_id: user.id
     - servicio: valor del select
     - fecha: fecha seleccionada (o null si no especificada)
     - estado: "solicitada"
     - notas: texto del textarea
     - created_at: now()
  2. Toast de éxito: "Tu solicitud fue enviada. El equipo del INEN te confirmará la cita."
  3. Cierra modal, router.refresh()
- La lista de citas debe mostrar también las de estado="solicitada" con badge "Pendiente de confirmación"
```

---

## 4. Eliminar WhatsApp y módulo Familiar

### Tarea

Busca y elimina TODO lo relacionado con:
- `app/(familiar)/` — eliminar toda la carpeta
- `app/api/whatsapp/` — eliminar toda la carpeta
- Cualquier import o referencia a `whatsapp` en cualquier archivo
- Cualquier referencia al rol `familiar` en Sidebar, middleware, types
- Columnas `familiar_id` o `notify_whatsapp` en queries de Supabase (solo remover del código, no tocar la DB)
- Links de navegación al módulo familiar si existen

Después de eliminar, verificar que el build no tenga errores de imports rotos.

---

## 5. Roadmap animado — proceso/page.tsx

### Contexto
`app/(paciente)/proceso/page.tsx` actualmente muestra una lista plana de pasos. Reemplazar con un roadmap visual animado.

### Tarea
Crea `components/proceso/RoadmapPasos.tsx` como Client Component:

```
Diseño: timeline vertical centrada con:
- Línea vertical punteada que conecta los pasos
- Cada paso: círculo con número, título, descripción breve, tiempo estimado
- Colores por estado:
  - completado: verde (#16a34a), círculo sólido con checkmark
  - en_curso: azul (#1a56db), círculo con animación pulse ring
  - pendiente: gris (#9ca3af), círculo vacío
- El paso "en_curso" se expande automáticamente mostrando info adicional
- Los pasos completados se colapsan (solo muestra título + check)
- Animación: al cargar, los pasos aparecen de arriba hacia abajo con delay escalonado (stagger 100ms)
- Responsive: en mobile, la línea va al costado izquierdo

Datos: recibe como prop `pasos: Array<{ id: number, nombre: string, descripcion: string, estado: string, tiempo_estimado: string, info_adicional: string }>`

En `proceso/page.tsx`:
- Hacer fetch de `proceso_paciente` JOIN `pasos` para el paciente autenticado
- Ordenar por paso_id ASC
- Pasar al componente RoadmapPasos

Diferenciación por tipo_paciente:
- Leer `tipo_paciente` de `usuarios`
- Mostrar badge en el header: "Chequeo preventivo" | "Con sospecha" | "Diagnóstico confirmado"
- El subtítulo cambia según el tipo
```

---

## 6. Módulo Información

### Tarea
Crea `app/(paciente)/informacion/page.tsx` con 6 categorías desplegables (accordion):

```
Categorías:
1. El proceso diagnóstico — timeline simplificado de los 5 pasos
2. Antes de tu cita — lista de qué llevar, qué esperar
3. Los exámenes — mamografía, ecografía, colposcopía, biopsia (qué es, duración, no duele?)
4. Si te indican tratamiento — tipos: cirugía, quimio, radioterapia, combinados
5. Cuidados durante el tratamiento — efectos secundarios y qué hacer (de la guía INEN):
   - Semana 2 post-quimio: defensas bajas, cómo protegerse
   - Náuseas, diarrea, estreñimiento, fatiga, mucositis, alopecia
   - EMERGENCIAS: fiebre >38°C, sangrado que no cede, sangre en orina → ir a INEN inmediatamente
6. Preguntas frecuentes — 8–10 preguntas comunes

Diseño:
- Accordion con animación (cada categoría se expande con slide-down)
- Ícono por categoría (lucide-react)
- Contenido en prosa simple, NO listas con bullets
- Card de emergencia siempre visible (no colapsable), color rojo suave, texto: "⚠️ Ve a emergencias del INEN si tienes fiebre mayor a 38°C, sangrado que no para, o sangre en la orina. Central: (01) 201-6000"
- Franja "Beta" en quechua cuando esté en idioma QU
```

---

## 7. Tipos de paciente en Registro

### Contexto
`app/(auth)/registro/page.tsx` ya tiene el campo `tipo_paciente` en el schema pero no tiene UI para seleccionarlo.

### Tarea
Añadir ANTES del botón de submit, 3 cards seleccionables:

```
<div className="grid grid-cols-1 gap-3">
  {[
    { value: "preventivo", label: "Vengo a un chequeo preventivo", icon: "🔍", desc: "Mamografía o Papanicolaou sin síntomas" },
    { value: "sospecha", label: "Tengo sospecha de cáncer", icon: "⚕️", desc: "Me enviaron del centro de salud o tengo síntomas" },
    { value: "diagnosticado", label: "Ya tengo un diagnóstico", icon: "📋", desc: "Confirman cáncer y empiezo tratamiento en el INEN" },
  ].map((tipo) => (
    <button
      key={tipo.value}
      type="button"
      onClick={() => setTipoPaciente(tipo.value)}
      className={`text-left p-4 rounded-xl border-2 transition-all ${
        tipoPaciente === tipo.value
          ? "border-[#1a56db] bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <span className="text-lg mr-2">{tipo.icon}</span>
      <span className="font-medium text-sm">{tipo.label}</span>
      <p className="text-xs text-gray-500 mt-1 ml-7">{tipo.desc}</p>
    </button>
  ))}
</div>
```

El campo `tipo_paciente` ya está en el INSERT de registro — solo conectar el estado al select.

---

## 8. Fix layout TopBar sticky

### Contexto
El header desaparece al hacer scroll porque el layout padre tiene `overflow-y-auto` en el contenedor que incluye el header.

### Tarea
En TODOS los layouts de paciente, admin, etc. que usan `<TopBar>`, verificar que la estructura sea:

```tsx
// Layout raíz: h-screen overflow-hidden
<div className="flex h-screen overflow-hidden bg-gray-50">
  <Sidebar />
  // Columna derecha: flex-col, h-screen, overflow-hidden
  <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
    <TopBar title="..." />
    // Solo el main tiene overflow-y-auto
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>
```

El `overflow-y-auto` SOLO va en el `<main>`, nunca en el contenedor que envuelve el `<TopBar>`.

Revisa y corrige los archivos:
- `app/(paciente)/layout.tsx`
- `app/(admin)/layout.tsx`

---

## 9. Login page — mejoras visuales

### Contexto
La página de login debe parecerse más a un diseño específico (fondo con gradiente, formulario centrado en card blanca, logo INEN, tipografía más clara).

### Tarea en `app/(auth)/login/page.tsx` y `registro/page.tsx`:

```
- Fondo: gradiente `bg-gradient-to-br from-blue-50 via-white to-indigo-50` o imagen de fondo médica con overlay
- Layout: pantalla completa centrada `min-h-screen flex items-center justify-center`
- Card del formulario: `bg-white rounded-2xl shadow-xl p-8 w-full max-w-md`
- Logo: centrado arriba del formulario, texto "OncoRuta" en azul + subtítulo "INEN · Mujer"
- Inputs: bordes redondeados `rounded-xl`, altura `h-12`, focus con `ring-2 ring-blue-500`
- Botón submit: `bg-[#1a56db] hover:bg-[#1648c4] rounded-xl h-12 font-semibold tracking-wide`
- Links: "¿No tienes cuenta? Regístrate" / "¿Ya tienes cuenta? Inicia sesión" en texto pequeño centrado
- Colores consistentes con el resto de la app (azul #1a56db)
```
