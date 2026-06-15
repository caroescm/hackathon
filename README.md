# OncoRuta — Portal de Navegación Diagnóstica

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)
![Groq](https://img.shields.io/badge/Groq-llama--3.1-orange)

Extensión del portal de paciente del INEN que convierte un sistema de consulta en un sistema de acompañamiento diagnóstico — con ruta visual paso a paso, chatbot bilingüe (español / quechua chanka) y panel de gestión para el equipo de Trabajo Social.

**Hackathon Transformagob 2026 — Instituto Nacional de Enfermedades Neoplásicas (INEN)**

---

## El problema

El INEN ya cuenta con un portal de paciente funcional: permite consultar citas, ver documentos y solicitar nuevas citas. Es una base sólida, pero no guía.

Una paciente que accede al portal hoy no sabe en qué paso de su proceso diagnóstico está, qué documentos necesita subir en cada etapa, cuánto demora el siguiente paso, ni a quién llamar si tiene una duda o una emergencia. El sistema existe, pero no acompaña.

Los datos del propio INEN confirman la urgencia del problema. Entre 2000 y 2024 se registraron **269,003 casos nuevos de cáncer**. El **cuello uterino** (37,224 casos) y la **mama** (32,769 casos) son los tipos más frecuentes, afectando principalmente a mujeres de 50 a 64 años. El **51.29% de los casos llega sin estadio clínico registrado** y el **29% se diagnostica ya en estadio avanzado** (estadio III o IV). El **89.55% de pacientes accede al servicio a través del SIS**, lo que confirma la vulnerabilidad económica del grupo objetivo.

Tres problemas concretos que el portal actual no resuelve: la paciente no conoce su ruta diagnóstica; el sistema no detecta ni alerta cuando una paciente deja de avanzar; y las citas y documentos se muestran de forma aislada, sin conectarlos en una ruta coherente de inicio a fin.

---

## Qué construimos

OncoRuta extiende el portal existente con una capa de navegación diagnóstica. No reemplaza nada — construye encima de lo que ya funciona.

### Portal de paciente

**Dashboard** (`/dashboard`)
Resumen del proceso actual, próxima cita, total de documentos subidos y etapa en curso. Accesos directos a las secciones principales.

**Mi Proceso** (`/proceso`)
Roadmap visual del proceso diagnóstico adaptado al tipo de paciente registrado: preventivo, sospecha o diagnosticado. Muestra el estado por paso (Pendiente / En curso / Completado) y tiempo estimado por etapa. Disponible en español y quechua chanka.

**Mis Citas** (`/citas`)
Lista de citas con detalle de servicio, fecha, hora y ubicación (piso). Historial de citas pasadas. Formulario para solicitar nueva cita — especialidades disponibles: Ginecología (lunes a viernes, mañana y tarde) y Mamas y Tejidos Blandos (lunes, miércoles y viernes).

**Mis Documentos** (`/documentos`)
Listado de documentos con estado: Enviado / En revisión / Aprobado / Rechazado. Subida de archivos con visualización del estado de revisión por el equipo admin.

**Información** (`/informacion`)
Acordeón con el proceso oficial del INEN en 6 pasos, criterios de admisión (examen anatomopatológico confirmatorio), días de atención por especialidad, qué llevar, exámenes de apoyo (mamografía, ecografía, colposcopía, biopsia), tipos de tratamiento y preguntas frecuentes. Alerta de emergencia médica fija.

**Mis Datos** (`/mis-datos`)
Datos personales del paciente: tipo de documento, DNI, nombres y apellidos, celular y email.

### Panel administrativo

**Dashboard admin** (`/admin/dashboard`)
Métricas en tiempo real: pacientes activos, citas del día, documentos pendientes de revisión, alertas de procesos sin avance en más de 7 días. Lista de pacientes con badge de prioridad calculado a partir del perfil de vulnerabilidad.

**Gestión de pacientes** (`/admin/pacientes`)
Tabla completa con filtros por prioridad (Alta / Media / Baja) y etapa del proceso. Acceso al expediente individual.

**Expediente de paciente** (`/admin/paciente/[id]`)
Datos personales, perfil de vulnerabilidad, proceso oncológico paso a paso, documentos con opción de aprobar o rechazar con comentario, historial de citas y notas internas del equipo.

**Gestión de citas** (`/admin/citas`)
Confirmación de solicitudes de cita enviadas por pacientes: asignación de fecha y hora.

**Doctores** (`/admin/doctores`)
Lista de doctores activos con especialidad y contacto. Formulario para agregar nuevos.

### Chatbot de acompañamiento

Botón flotante presente en toda la plataforma. Al iniciar, la paciente elige el idioma: **español** o **quechua chanka**. El chatbot responde con el contexto real de la paciente: tipo de paciente registrado, paso actual del proceso, próximas citas y documentos pendientes.

Las respuestas son empáticas, no clínicas — valida lo que siente la paciente antes de dar información. Incluye frases fijas para escenarios críticos en quechua chanka (emergencia, miedo, contactos del INEN). Escala a humano cuando corresponde: "Puedes llamar a Trabajo Social al (01) 201-6000 ext. 2050."

Powered by **Groq API** con modelo `llama-3.1-8b-instant`.

---

## Tech stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **Next.js 14** (App Router) | Server Components por defecto, layouts por grupo de ruta `(paciente)` / `(admin)` / `(auth)`, sin servidor separado |
| Estilos | **Tailwind CSS 3.4** | `darkMode: "class"` — toggle de modo oscuro sin recarga, mobile-first |
| Base de datos | **Supabase (PostgreSQL)** | Row Level Security (RLS), Auth integrado con cookies, Storage para documentos |
| Auth | **Supabase Auth** | Sesión con `@supabase/ssr`. `createClient()` para lectura autenticada; `createServiceClient()` para operaciones admin que requieren bypass de RLS |
| IA | **Groq API** | Inferencia de baja latencia con `llama-3.1-8b-instant`; respuestas contextualizadas con datos reales de la paciente |
| i18n | **IdiomaContext propio** (`lib/i18n/`) | Switch en runtime, sin dependencias externas — español y quechua chanka en toda la UI |
| Deploy | **Vercel** | Deploy automático desde rama `main` |

---

## Arquitectura

```
Browser
  │
  ├── /dashboard, /proceso, /citas, /documentos, /mis-datos, /informacion
  │     └── Next.js Server Components
  │           ├── createClient()         → verifica sesión (cookie)
  │           └── createServiceClient()  → Supabase PostgreSQL (bypass RLS)
  │
  ├── POST /api/chat
  │     ├── Verifica sesión (Supabase Auth)
  │     ├── Consulta contexto real: proceso_paciente, citas, documentos, usuarios
  │     └── Groq API → llama-3.1-8b-instant → respuesta empática ES / QU
  │
  ├── Client Components (mutaciones)
  │     ├── SolicitarCita     → citas.insert
  │     ├── SubirDocumento    → Storage upload + documentos.insert
  │     ├── RevisarDocumento  → documentos.update  (admin)
  │     └── AgregarNota       → notas_internas.insert  (admin)
  │
  └── middleware.ts
        ├── Rutas públicas:  /login, /registro
        ├── Rutas paciente:  /dashboard, /proceso, /citas, /documentos,
        │                    /informacion, /mis-datos
        └── Rutas admin:     /admin/*  (requiere rol = "admin")

Supabase (PostgreSQL)
  ├── auth.users
  ├── usuarios              (dni, nombre, telefono, email, rol, idioma, tipo_paciente)
  ├── perfil_vulnerabilidad (jefa_hogar, de_provincia, tiene_discapacidad, habla_quechua)
  ├── pasos                 (nombre, descripcion, orden)
  ├── proceso_paciente      (paciente_id, paso_id, estado, tiempo_estimado_dias)
  ├── citas                 (paciente_id, servicio, fecha, hora, piso, estado, que_llevar)
  ├── documentos            (paciente_id, nombre, url, estado, comentario_admin, subido_en)
  ├── notas_internas        (paciente_id, admin_id, contenido)
  └── doctores              (nombre, especialidad, email, telefono, activo)
```

---

## Cómo correr localmente

**Requisitos**
- Node.js 18 o superior
- Proyecto creado en [Supabase](https://supabase.com)
- API key de [Groq](https://console.groq.com)

**Variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

**Instalación**

```bash
npm install
npm run dev
```

La aplicación corre en `http://localhost:3000`.

**Seed de datos demo**

Para cargar datos de prueba en Supabase (requiere `SUPABASE_SERVICE_ROLE_KEY`):

```bash
npm run seed
```

Crea una paciente demo, doctores, proceso completo con 6 pasos, citas y documentos de ejemplo.

---

## Credenciales demo

| Rol | DNI | Contraseña |
|---|---|---|
| Paciente | `47382910` | `Demo1234!` |
| Admin | Configurar en Supabase con `rol = "admin"` | — |

El login acepta el DNI como identificador. Internamente se mapea al email `{dni}@inen.gob.pe` en Supabase Auth.

---

## Cumplimiento de lineamientos

| Lineamiento | Implementación |
|---|---|
| **WCAG 2.2** — Resolución PCM/SGTD N°001-2025 | Contraste de colores, navegación por teclado, etiquetas en todos los campos de formulario, soporte de modo oscuro (`darkMode: "class"`) |
| **Lenguas originarias** — Lineamiento de Accesibilidad Digital | Soporte completo de quechua chanka en portal de paciente y chatbot. Switch de idioma en runtime vía `IdiomaContext` sin dependencias externas |
| **Ley N° 29733** — Protección de Datos Personales | Row Level Security en Supabase: cada paciente accede solo a sus propios datos. `SUPABASE_SERVICE_ROLE_KEY` usada únicamente en servidor, nunca expuesta al cliente |
| **Ley General de Salud** | Datos clínicos gestionados únicamente por personal con `rol = "admin"`. Notas internas no visibles para la paciente |

---

## Funcionalidades post-hackathon

- Notificaciones por WhatsApp (WhatsApp Business API)
- Perfil de familiar cuidador con acceso de solo lectura
- Habilitación automática de la siguiente cita al aprobar documento
- Selector de idioma explícito en el registro
- Alertas activas de inactividad para el equipo admin
- Contenido completo en quechua chanka en la sección Información

---

## Hackathon Transformagob 2026

Desarrollado para el reto INEN del Hackathon Transformagob 2026.

**Institución:** Instituto Nacional de Enfermedades Neoplásicas (INEN), Lima, Perú.
