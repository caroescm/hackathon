# PRD — Mejora del Portal de Paciente INEN: Capa de Navegación Diagnóstica
**Hackatón Transformagob 2026 | INEN**
**Versión 3.0 | Junio 2026**

---

## 1. Resumen Ejecutivo

El INEN ya tiene un portal de paciente con funcionalidades básicas: consultar citas, solicitar citas y ver documentos digitales. Es una base sólida.

El problema es que ese portal no guía. Una paciente que entra no sabe en qué paso de su proceso diagnóstico está, qué viene después, qué documentos necesita subir, ni cuánto tiempo falta. El sistema existe pero no acompaña.

Esta propuesta **extiende el portal existente** con una capa de navegación diagnóstica: el conjunto de funcionalidades que convierten un portal de consulta en un sistema de acompañamiento real. No reemplaza nada. Construye encima de lo que ya funciona.

---

## 2. El Problema

### Contexto — Datos Reales del INEN

Fuente: Sistema de Información del INEN / Departamento de Epidemiología y Estadística del Cáncer (actualizado abril 2026).

- **269,003** casos nuevos de cáncer registrados entre 2000 y 2024.
- **Cuello uterino** (#1 con 37,224 casos) y **mama** (#2 con 32,769 casos) son los más frecuentes.
- **62.5% de casos son mujeres**, con mayor concentración en el grupo de 50-64 años (55,040 casos).
- **51.29% sin estadio clínico registrado** — más de la mitad llega sin diagnóstico definido.
- **29% diagnosticada en estadio avanzado** (14.87% estadio IV + 14.15% estadio III).
- **89.55% de pacientes son SIS** — confirma la vulnerabilidad económica del grupo objetivo.
- Pacientes de todo el país: Lima, Piura, Ancash, Ayacucho, Huancavelica, Junín, Cajamarca.

### Lo que el portal actual tiene vs. lo que falta

| Funcionalidad | Portal actual | Mejora propuesta |
|---|---|---|
| Consultar citas | ✅ | ✅ se mantiene |
| Ver resultados / documentos | ✅ | ✅ se mantiene |
| Solicitar citas | ✅ | ✅ se mantiene |
| Ver ruta diagnóstica completa (5 pasos) | ❌ | ✅ nuevo |
| Estado actual del proceso | ❌ | ✅ nuevo |
| Tiempo estimado por paso | ❌ | ✅ nuevo |
| Subida de documentos con aprobación | ❌ | ✅ nuevo |
| Recordatorios automáticos por WhatsApp | ❌ | ✅ nuevo |
| Chatbot de acompañamiento | ❌ | ✅ nuevo |
| Panel para asistenta social | ❌ | ✅ nuevo |
| Priorización por vulnerabilidad | ❌ | ✅ nuevo |
| Acceso para familiar cuidador | ❌ | ✅ nuevo |
| Soporte en quechua | ❌ | ✅ nuevo |
| Alertas de pacientes inactivas | ❌ | ✅ nuevo |

### Los tres problemas que el portal actual no resuelve

**1. Falta de información**
La paciente no conoce su ruta diagnóstica. No sabe qué paso sigue, cuánto demora, ni qué documentos necesita en cada etapa.

**2. Falta de seguimiento**
Si la paciente no avanza o no aparece, el sistema no lo detecta ni avisa a nadie.

**3. Fragmentación entre pasos**
El portal muestra citas y documentos de forma aislada, sin conectarlos en una ruta coherente de inicio a fin.

---

## 3. Usuarios

### Perfil 1 — Paciente de provincia (nivel digital básico)
- 52 años, Ayacucho, cáncer de mama, quechua/español
- Necesita: fechas claras, indicaciones simples, reducir viajes innecesarios
- Dificultades: conectividad limitada, barreras de idioma, costos de traslado

### Perfil 2 — Paciente trabajadora (nivel digital intermedio)
- 38 años, Lima, cáncer de mama en tratamiento
- Necesita: gestionar todo desde el celular, recordatorios automáticos
- Dificultades: falta de tiempo, múltiples trámites

### Perfil 3 — Paciente adulta mayor (nivel digital muy bajo)
- 68 años, Huancavelica
- Necesita: interfaz muy simple, letras grandes, apoyo audiovisual
- Dificultades: poco manejo de tecnología, problemas visuales

### Perfil 4 — Familiar cuidador (nivel digital alto)
- 45 años, hija de paciente
- Necesita: seguimiento del proceso de su familiar, alertas y recordatorios
- Rol: acceso de solo lectura, vinculado al perfil de la paciente

### Perfil 5 — Asistenta social / Navegadora (Admin)
- Personal del INEN
- Necesita: visibilidad de todas sus pacientes, alertas de quién está atrasada, gestión de documentos
- Acceso desde computadora del hospital

---

## 4. El Proceso Diagnóstico Real (5 pasos del INEN)

Basado en el flujograma oficial del reto Hackatón INEN 2026.

| Paso | Nombre | Qué necesita la paciente |
|---|---|---|
| 0 | Preparación (antes de llegar) | DNI, hoja de referencia, documentos clínicos |
| 1 | Admisión y evaluación | Presentar documentos, esperar evaluación de criterios de admisión |
| 2 | Apertura de HC y asignación de cita | Recibir fecha de primera cita |
| 3 | Primera consulta con especialista | Evaluación inicial, conocer qué exámenes vienen |
| 4 | Exámenes de apoyo diagnóstico | Mamografía, ecografía, colposcopía, biopsia |
| 5 | Evaluación diagnóstica y resultado | Resultado final → inicio de tratamiento |

---

## 5. Nuevas Funcionalidades a Agregar al Portal

### 5.1 Nuevas secciones en el perfil de paciente

#### Mi Proceso *(nuevo)*
- Línea de tiempo con los 5 pasos reales del proceso diagnóstico del INEN
- Estado por paso: Pendiente / En curso / En revisión / Completado
- Tiempo estimado por paso
- Indicador visual del paso actual

#### Mis Documentos — ampliado *(mejora)*
- Subir documentos por paso (foto desde celular o PDF)
- Estado del documento: Enviado / En revisión / Aprobado / Rechazado + comentario
- Historial de todos los documentos subidos
- *(El portal actual solo permite ver documentos ya existentes, no subirlos)*

#### Mis Citas — ampliado *(mejora)*
- Se mantiene la funcionalidad actual de consulta y solicitud
- Se agrega: detalle de qué llevar a cada cita
- Se agrega: habilitación de la siguiente cita solo tras aprobación del paso actual

#### Información *(nuevo)*
- Qué es cada examen y qué esperar
- Qué documentos llevar en cada paso
- Preguntas frecuentes: cómo llegar, qué pasa si no puedo ir, cuánto demora
- En español y quechua
- Modo accesible: texto grande, íconos

#### Botón WhatsApp *(nuevo)*
- Fijo en toda la plataforma
- Acceso directo al chatbot de acompañamiento

### 5.2 Nuevas opciones al registrarse *(mejora del registro)*

- Selección de idioma: español o quechua
- Perfil de vulnerabilidad: jefa de hogar, viene de provincia, tiene discapacidad, habla quechua → genera etiqueta de "alta prioridad" visible para la asistenta social

### 5.3 Nuevo perfil: Familiar cuidador *(nuevo)*

- Acceso autorizado al proceso de la paciente (previa vinculación)
- Vista de solo lectura: pasos, citas, estado de documentos
- Recibe las mismas notificaciones de WhatsApp que la paciente

### 5.4 Nuevo perfil: Asistenta social / Admin *(nuevo)*

#### Panel principal
- Lista de pacientes con estado del proceso
- Etiqueta "alta prioridad" para pacientes vulnerables
- Filtros: por estado, por días sin avanzar, por prioridad
- Alerta automática de pacientes sin actividad

#### Gestión de documentos
- Revisar documentos subidos por las pacientes
- Aprobar o rechazar con comentario
- Al aprobar: habilita automáticamente el agendamiento de la siguiente cita

#### Ficha de paciente
- Historial completo: pasos, documentos, citas, perfil de vulnerabilidad
- Notas internas (no visibles para la paciente)

### 5.5 WhatsApp y chatbot *(nuevo)*

**Notificaciones automáticas:**

| Evento | Mensaje |
|---|---|
| Registro exitoso | Bienvenida + resumen de los 5 pasos |
| Cita asignada | Fecha, hora, servicio, qué llevar |
| Recordatorio | 24h antes y 2h antes de cada cita |
| Documento aprobado | "Ya puedes agendar tu siguiente paso" |
| Documento rechazado | Qué corregir + comentario de la asistenta |
| Paso completado | Qué viene después |

En español o quechua según preferencia de la paciente.

**Chatbot:**
- "¿En qué paso estoy?"
- "¿Cuál es mi próxima cita?"
- "¿Qué tengo que llevar?"
- "¿Cómo llego al servicio X?"
- "¿Qué pasa si no puedo ir?"
- "Quiero hablar con una asistenta" → escala a humano

---

## 6. Flujos Principales

### Flujo Paciente
```
Login al portal existente
     ↓
Nueva sección: Ver Mi Proceso (5 pasos)
     ↓
Subir documento del paso actual
     ↓
Esperar aprobación → notificación por WhatsApp
     ↓
Agendar siguiente cita (habilitado al aprobar)
     ↓
Recordatorio 24h y 2h antes por WhatsApp
     ↓
Paso completado → avanza al siguiente
     ↓
[Repite hasta diagnóstico definitivo]
```

### Flujo Admin
```
Login como asistenta social
     ↓
Panel: ver pacientes con alertas y prioridades
     ↓
Revisar documento → aprobar o rechazar
     ↓
Sistema notifica a paciente por WhatsApp
     ↓
Monitorear avance del panel
```

---

## 7. Tech Stack

| Capa | Tecnología | Rol |
|---|---|---|
| Frontend | Next.js 14 + Tailwind CSS | Framework principal, responsivo, mobile-first |
| Backend | Next.js API Routes | Endpoints del servidor, sin servidor separado |
| Base de datos + Auth + Storage | Supabase | PostgreSQL + autenticación + almacenamiento de documentos |
| Mensajería y chatbot | Twilio WhatsApp API | Notificaciones automáticas y chatbot |
| Hosting | Vercel | Deploy automático, URL pública real, tier gratuito |

---

## 8. Requisitos No Funcionales

| Requisito | Detalle |
|---|---|
| Accesibilidad | Modo texto grande, íconos claros, lenguaje simple (WCAG 2.1) |
| Responsivo | Mobile-first — celular, tablet y computadora |
| Idiomas | Español y quechua (mensajes críticos) |
| Privacidad | Cumplimiento Ley N.° 29733 y Ley General de Salud |
| Interoperabilidad | Extensión del portal existente del INEN, no sistema paralelo |

---

## 9. Fuera del Alcance

- Reescritura del portal existente del INEN
- Integración directa con SISINEN o REFCON
- IA clínica o diagnóstico automático
- Historia clínica electrónica completa
- Pago de citas en línea
- Perfil de voluntaria orientadora (escalamiento futuro)
- Traducción completa al quechua (solo mensajes críticos en esta etapa)

---

## 10. Modelo de Piloto Post-Hackathon

3 meses para lanzar con:
- Extensión del portal actual del INEN con las nuevas secciones
- WhatsApp Business API (~$0 inicial)
- 50 pacientes piloto en servicios de mama y cérvix
- 2 asistentas sociales como navegadoras digitales
- Sin modificar sistemas legacy del INEN

---

## 11. Entregables para la Hackathon

| Entregable | Descripción |
|---|---|
| Prototipo navegable | Wireframe clickeable con flujo de paciente y admin |
| Flujo del chatbot | Árbol de conversación del bot de WhatsApp |
| Presentación del pitch | Historia de paciente + datos reales + propuesta de piloto |
| Arquitectura técnica | Diagrama de extensión sobre el portal existente |
