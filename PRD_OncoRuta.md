# PRD — Mejora del Portal de Paciente INEN: Capa de Navegación Diagnóstica
**Hackatón Transformagob 2026 | INEN**
**Versión 4.0 | Junio 2026**

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

### Lo que el portal actual tiene vs. lo que construimos

| Funcionalidad | Portal actual | OncoRuta (construido) |
|---|---|---|
| Consultar citas | ✅ | ✅ se mantiene y amplía |
| Ver resultados / documentos | ✅ | ✅ se mantiene y amplía |
| Solicitar citas | ✅ | ✅ se mantiene |
| Ver ruta diagnóstica completa (adaptada por tipo) | ❌ | ✅ implementado |
| Estado actual del proceso con tiempo estimado | ❌ | ✅ implementado |
| Subida de documentos con aprobación | ❌ | ✅ implementado |
| Chatbot de acompañamiento (español y quechua) | ❌ | ✅ implementado |
| Panel admin con priorización por vulnerabilidad | ❌ | ✅ implementado |
| Soporte en quechua chanka | ❌ | ✅ implementado |
| Modo oscuro | ❌ | ✅ implementado |
| Recordatorios automáticos por WhatsApp | ❌ | 🔜 post-hackathon |
| Acceso para familiar cuidador | ❌ | 🔜 post-hackathon |

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

### Perfil 4 — Asistenta social / Navegadora (Admin)
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

OncoRuta adapta la ruta mostrada según el tipo de paciente registrado: **preventivo** (chequeo sin síntomas), **sospecha** (referida con síntomas), o **diagnosticado** (confirmación e inicio de tratamiento).

---

## 5. Funcionalidades Implementadas

### 5.1 Registro y autenticación

- Registro de paciente con: nombre completo, DNI (usado como usuario), teléfono, email opcional, contraseña
- Selección del tipo de situación al registrarse: **chequeo preventivo**, **sospecha de cáncer**, o **diagnóstico confirmado** — determina la ruta diagnóstica que se muestra
- Perfil de vulnerabilidad al registrarse: jefa de hogar, viene de provincia, tiene discapacidad, habla quechua → genera etiqueta de prioridad visible para el admin
- Login con DNI como identificador
- Autenticación gestionada por Supabase Auth con RLS

### 5.2 Portal paciente — Dashboard

- Resumen visual: próxima cita, total de documentos, etapa actual del proceso
- Accesos directos a documentos y citas
- Vista rápida del proceso diagnóstico con estado por paso

### 5.3 Portal paciente — Mi Proceso

- Roadmap visual adaptado al tipo de paciente (preventivo / sospecha / diagnosticado)
- Estado por paso: Pendiente / En curso / Completado
- Tiempo estimado por paso
- Descripción e información adicional por paso (qué llevar, qué esperar)
- Disponible en español y quechua chanka

### 5.4 Portal paciente — Mis Documentos

- Listado de documentos subidos con estado: Enviado / En revisión / Aprobado / Rechazado
- Subida de documentos por paso (formulario con nombre, tipo, archivo)
- Historial completo de documentos del expediente

### 5.5 Portal paciente — Mis Citas

- Ver próximas citas con detalle: servicio, fecha, hora, ubicación (piso), estado
- Ver historial de citas pasadas
- Solicitar nueva cita (queda en estado "pendiente de confirmación")

### 5.6 Portal paciente — Información

- Acordeón con preguntas frecuentes del proceso INEN (qué llevar, cuánto demora, qué son los exámenes)
- Contactos del INEN: central, Trabajo Social, Psicología Oncológica
- Aviso de emergencias médicas siempre visible (fiebre, sangrado, dificultad respiratoria)
- Nota informativa en quechua cuando se usa ese idioma

### 5.7 Chatbot de acompañamiento

- Botón flotante presente en toda la plataforma (paciente y admin)
- Selección de idioma al iniciar la conversación: español o quechua chanka
- Responde con el contexto real de la paciente: tipo de paciente, paso actual, próximas citas, documentos pendientes
- Respuestas empáticas, no clínicas — valida emociones antes de dar información
- Soporte en quechua chanka con frases fijas para escenarios críticos (emergencia, miedo, contactos)
- Escalamiento a humano: "Llama a Trabajo Social al (01) 201-6000 ext. 2050"
- Powered by Groq API con modelo `llama-3.1-8b-instant`

### 5.8 Panel admin — Dashboard

- Estadísticas: total de pacientes activos, citas del día, documentos pendientes de revisión, alertas de procesos sin avance
- Lista de pacientes recientes con etapa actual y badge de prioridad
- Lista de doctores activos
- Contador de alertas: procesos sin avanzar en más de 7 días

### 5.9 Panel admin — Pacientes

- Tabla completa de todos los pacientes registrados
- Filtros por prioridad (Alta / Media / Baja) y por etapa del proceso
- Badge de prioridad calculado automáticamente del perfil de vulnerabilidad
- Acceso directo al expediente de cada paciente

### 5.10 Panel admin — Expediente de paciente

- Datos personales: nombre, DNI, teléfono, idioma
- Perfil de vulnerabilidad con badge de prioridad (Alta / Media)
- Proceso oncológico completo con estado visual por paso
- Documentos del paciente con opción de aprobar o rechazar con comentario
- Historial de citas
- Notas internas del equipo (solo visible para admin)

### 5.11 Panel admin — Citas

- Confirmar solicitudes de cita enviadas por pacientes: asignar fecha y hora

### 5.12 Panel admin — Doctores

- Lista de doctores registrados con especialidad, contacto y estado
- Formulario para agregar nuevo doctor

---

## 6. Flujos Principales

### Flujo Paciente
```
Registro → selección de tipo de paciente + perfil de vulnerabilidad
     ↓
Dashboard → resumen del proceso, próxima cita, documentos
     ↓
Mi Proceso → roadmap adaptado con tiempo estimado por paso
     ↓
Mis Documentos → subir documento del paso actual
     ↓
Admin revisa → aprueba o rechaza con comentario
     ↓
Mis Citas → solicitar cita para el siguiente paso
     ↓
Admin confirma → asigna fecha y hora
     ↓
Información → consultar qué llevar, contactos INEN
     ↓
Chatbot → resolver dudas en español o quechua
```

### Flujo Admin
```
Login como admin
     ↓
Dashboard → ver métricas, pacientes con alerta, documentos pendientes
     ↓
Expediente de paciente → revisar perfil de vulnerabilidad + proceso
     ↓
Revisar documentos → aprobar o rechazar con comentario
     ↓
Confirmar cita solicitada → asignar fecha y hora
     ↓
Notas internas → registrar observaciones del caso
```

---

## 7. Tech Stack

| Capa | Tecnología | Detalle |
|---|---|---|
| Frontend | Next.js 14 App Router + Tailwind CSS | `darkMode: "class"`, mobile-first, App Router con layouts por grupo de ruta |
| Backend | Next.js API Routes (`app/api/`) | Sin servidor separado — endpoints del servidor en el mismo repo |
| Base de datos + Auth + Storage | Supabase | PostgreSQL + Row Level Security (RLS) + Supabase Auth |
| IA / Chatbot | Groq API | Modelo `llama-3.1-8b-instant` vía `groq-sdk`, `app/api/chat/route.ts` |
| Internacionalización | IdiomaContext propio (`lib/i18n/`) | Español y quechua chanka — switch en runtime sin dependencias externas |
| Hosting | Vercel | Deploy automático desde rama main |

---

## 8. Requisitos No Funcionales

| Requisito | Detalle |
|---|---|
| Accesibilidad | Modo oscuro (`darkMode: "class"`), íconos claros, lenguaje simple |
| Responsivo | Mobile-first — celular, tablet y computadora |
| Idiomas | Español y quechua chanka en toda la UI (portal paciente y chatbot) |
| Privacidad | Cumplimiento Ley N.° 29733 y Ley General de Salud; RLS en Supabase |
| Interoperabilidad | Extensión del portal existente del INEN, no sistema paralelo |
| Rendimiento | Server Components por defecto; Client Components solo donde hay interacción |

---

## 9. Funcionalidades Post-Hackathon

Estas funcionalidades fueron diseñadas pero no alcanzaron a implementarse en el hackathon:

- **Notificaciones por WhatsApp** — integración con WhatsApp Business API (Twilio u otro proveedor) para enviar recordatorios de cita, confirmación de documentos aprobados y avance de pasos
- **Perfil de familiar cuidador** — acceso de solo lectura al proceso de una paciente, vinculado con su autorización, con las mismas notificaciones
- **Habilitación automática de siguiente cita al aprobar documento** — actualmente la aprobación actualiza el estado del documento en BD; el desbloqueo del agendamiento de la siguiente cita requiere lógica adicional
- **Selector de idioma explícito en el registro** — actualmente el idioma se infiere del flag `hablaQuechua` del perfil de vulnerabilidad; se propone un selector independiente español / quechua
- **Alertas activas de inactividad** — el dashboard admin ya cuenta procesos con más de 7 días sin avance; falta un sistema que notifique activamente (email o mensaje) al equipo cuando se supera ese umbral
- **Contenido completo en quechua en la sección Información** — actualmente el acordeón está en español con nota beta en quechua

---

## 10. Modelo de Piloto Post-Hackathon

3 meses para lanzar con:
- Extensión del portal actual del INEN con las nuevas secciones
- WhatsApp Business API (~$0 inicial)
- 50 pacientes piloto en servicios de mama y cérvix
- 2 asistentas sociales como navegadoras digitales
- Sin modificar sistemas legacy del INEN

---

## 11. Entregables de la Hackathon

| Entregable | Descripción |
|---|---|
| Aplicación web funcional | Next.js 14 desplegado en Vercel con flujo completo de paciente y admin |
| Portal de paciente | Dashboard, Mi Proceso, Mis Documentos, Mis Citas, Información — funcional con datos reales |
| Panel administrativo | Dashboard, lista de pacientes con filtros, expediente completo, revisión de documentos, gestión de citas y doctores |
| Chatbot de acompañamiento | Asistente IA en español y quechua chanka conectado a datos reales de la paciente |
| Internacionalización | UI completa en español y quechua chanka con IdiomaContext propio |
| Presentación del pitch | Historia de paciente + datos reales del INEN + propuesta de piloto |
