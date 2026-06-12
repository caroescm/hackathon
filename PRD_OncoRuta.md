# PRD — Plataforma de Navegación Diagnóstica Oncológica
**Hackatón Transformagob 2026 | INEN**
**Versión 1.0 | Junio 2026**

---

## 1. Resumen Ejecutivo

Esta plataforma web de navegación digital acompaña a mujeres de 30 a 65 años en situación de vulnerabilidad durante todo su proceso diagnóstico de cáncer de mama y cérvix en el Instituto Nacional de Enfermedades Neoplásicas (INEN), reduciendo las demoras, la fragmentación y la pérdida de seguimiento.

La plataforma tiene dos perfiles: **paciente** y **administrador (asistenta social)**. Incluye gestión del proceso diagnóstico, carga y aprobación de documentos, agendamiento de citas, notificaciones por WhatsApp y un chatbot de acompañamiento.

---

## 2. El Problema

### Contexto
El INEN atiende más de 12,900 casos nuevos de cáncer al año. Aproximadamente 5,091 corresponden a mujeres de 30 a 65 años, principalmente con cáncer de mama y cuello uterino.

### Tres problemas centrales

**1. Falta de información**
La paciente no conoce su ruta diagnóstica completa. No sabe qué paso sigue, cuánto demora, qué documentos necesita ni dónde ir. Tiene que descubrirlo sola en cada visita.

**2. Falta de seguimiento**
Si la paciente no aparece a una cita o no avanza al siguiente paso, el sistema no la busca. Cae sola y en silencio.

**3. Fragmentación del proceso**
Cada servicio del INEN opera de forma independiente. La paciente es el único hilo conductor entre todos sus pasos: ella lleva los papeles, ella coordina, ella pregunta.

### Impacto real
- Más del 50% de pacientes nuevas llega sin estadio clínico definido.
- ~30% es diagnosticada en estadio III o IV (cáncer avanzado).
- 70% reportó haberse trasladado entre servicios sin orientación.
- Grupos más afectados: jefas de hogar, mujeres con discapacidad, quechuahablantes, pacientes de provincia.

---

## 3. Objetivo de la Solución

Darle a cada paciente un acompañante digital que le diga en todo momento dónde está en su proceso, qué viene después, y qué necesita hacer — y darle a la asistenta social una vista centralizada para intervenir antes de que una paciente se pierda del sistema.

---

## 4. Usuarios

### Paciente
- Mujer de 30 a 65 años con sospecha de cáncer de mama o cérvix atendida en el INEN.
- Puede ser jefa de hogar, tener discapacidad, ser quechuahablante, venir de provincia.
- Acceso desde celular personal (principalmente) o computadora de recepción del INEN.
- Nivel de alfabetización digital: básico a medio.

### Asistenta Social / Navegadora (Admin)
- Personal del INEN encargado de acompañar y hacer seguimiento a las pacientes.
- Acceso desde computadora del hospital.
- Necesita visibilidad del estado de todas sus pacientes asignadas.

---

## 5. Funcionalidades

### 5.1 Acceso y Registro

| Funcionalidad | Descripción |
|---|---|
| Registro de paciente | Nombre, DNI, teléfono, correo (opcional), contraseña |
| Login | Acceso con DNI + contraseña |
| Selección de idioma | Español o Quechua al iniciar sesión (aplica a toda la interfaz) |
| Perfil de vulnerabilidad | Al registrarse: marcar si es jefa de hogar, viene de provincia, tiene discapacidad, habla quechua. Genera etiqueta de "alta prioridad" visible para la asistenta social. |
| Login Admin | Acceso diferenciado para asistentas sociales con credenciales del INEN |

---

### 5.2 Perfil Paciente

#### Sección: Mi Proceso
- Visualización de la ruta diagnóstica completa (línea de tiempo o pasos numerados).
- Indicador del paso actual y los completados.
- Tiempo estimado de cada paso ("La mamografía tarda entre 3 y 7 días en tener resultados").
- Estado de cada paso: Pendiente / En revisión / Aprobado / Completado.

#### Sección: Mis Documentos
- Subir documentos por paso (foto desde celular o PDF).
- Estado de cada documento: Enviado / En revisión / Aprobado / Rechazado (con comentario).
- Historial de documentos subidos.

#### Sección: Mis Citas
- Ver próxima cita: fecha, hora, piso/servicio, qué llevar.
- Agendar siguiente cita (habilitado solo cuando el paso actual está aprobado).
- Selección de fecha y hora disponible.
- Confirmación de cita con resumen.

#### Sección: Información
- Qué es el proceso diagnóstico de mama y cérvix.
- Qué esperar en cada examen.
- Preguntas frecuentes: qué llevar, cómo llegar, qué pasa si no puedo ir.
- Contenido en español y quechua según idioma seleccionado.

#### Botón WhatsApp
- Botón fijo visible en toda la plataforma.
- Redirige a chat de WhatsApp con el chatbot.
- El chatbot responde: recordatorios de cita, estado del proceso, preguntas frecuentes, orientación de cómo llegar.

---

### 5.3 Perfil Admin (Asistenta Social)

#### Panel Principal
- Lista de todas las pacientes asignadas.
- Estado del proceso de cada una (en qué paso está).
- Etiqueta visual de "alta prioridad" para pacientes vulnerables.
- Filtros: por estado, por tiempo sin avanzar, por prioridad.
- Alerta automática si una paciente lleva más de X días sin avanzar al siguiente paso.

#### Gestión de Documentos
- Notificación de documentos pendientes de revisión.
- Vista del documento subido por la paciente.
- Botón de Aprobar o Rechazar (con campo de comentario en caso de rechazo).
- Al aprobar: el sistema habilita automáticamente la opción de agendar la siguiente cita para la paciente.

#### Gestión de Citas
- Ver citas agendadas por las pacientes.
- Confirmar disponibilidad de agenda.
- Editar o reprogramar citas si es necesario.

#### Ficha de Paciente
- Ver perfil completo: datos personales, perfil de vulnerabilidad, historial de pasos, documentos, citas.
- Agregar notas internas (no visibles para la paciente).

---

### 5.4 Notificaciones por WhatsApp

Automáticas, disparadas por eventos del sistema:

| Evento | Mensaje |
|---|---|
| Registro exitoso | Bienvenida + resumen del proceso |
| Cita agendada | Confirmación con fecha, hora, lugar y qué llevar |
| Recordatorio de cita | 24 horas antes y 2 horas antes |
| Documento aprobado | "Tu documento fue aprobado. Ya puedes agendar tu siguiente cita." |
| Documento rechazado | "Tu documento necesita corrección: [comentario de la asistenta]" |
| Paso completado | "Completaste el paso X. El siguiente es: [nombre del paso]" |

Idioma según preferencia seleccionada (español o quechua).

---

### 5.5 Chatbot de WhatsApp

Responde consultas frecuentes de la paciente:

- "¿Cuál es mi próxima cita?"
- "¿Qué tengo que llevar?"
- "¿Cómo llego al piso 3?"
- "¿Qué pasa si no puedo ir?"
- "¿En qué paso estoy?"
- "Quiero hablar con una asistenta social" → escala a humano

---

## 6. Flujo Principal del Usuario (Paciente)

```
Registro → Selección de idioma → Perfil de vulnerabilidad
     ↓
Panel principal → Ver ruta diagnóstica
     ↓
Subir documento del paso actual
     ↓
Esperar aprobación de asistenta social
(Notificación por WhatsApp al aprobar/rechazar)
     ↓
Agendar siguiente cita (habilitado tras aprobación)
(Notificación de confirmación por WhatsApp)
     ↓
Recordatorio automático 24h y 2h antes
     ↓
Paso completado → Avanza al siguiente
     ↓
[Repite hasta diagnóstico definitivo]
```

---

## 7. Flujo Principal del Usuario (Admin)

```
Login → Panel de pacientes
     ↓
Ver alertas: documentos pendientes / pacientes sin avanzar
     ↓
Revisar documento subido por paciente
     ↓
Aprobar o rechazar (con comentario)
     ↓
Sistema notifica automáticamente a la paciente por WhatsApp
     ↓
Confirmar disponibilidad de agenda para siguiente paso
     ↓
Monitorear avance general del panel
```

---

## 8. Tech Stack

### Frontend
| Tecnología | Uso |
|---|---|
| **Next.js 14** | Framework principal — maneja frontend y backend en un solo repositorio |
| **Tailwind CSS** | Estilos — responsivo por defecto, rápido de implementar |

### Backend
| Tecnología | Uso |
|---|---|
| **Next.js API Routes** | Endpoints del servidor — dentro del mismo proyecto, sin servidor separado |

### Base de Datos, Auth y Storage
| Tecnología | Uso |
|---|---|
| **Supabase** | Base de datos PostgreSQL + autenticación de usuarios + almacenamiento de documentos subidos por las pacientes. Todo en uno, panel visual, tier gratuito suficiente para la hackathon. |

### Mensajería y Chatbot
| Tecnología | Uso |
|---|---|
| **Twilio WhatsApp API** | Envío de notificaciones automáticas y chatbot conversacional. Sandbox gratuito disponible para demo. |

### Hosting y Deploy
| Tecnología | Uso |
|---|---|
| **Vercel** | Deploy automático desde GitHub. URL pública real en segundos. Tier gratuito. |

### Por qué este stack para 48 horas
- Todo gratuito en tier demo — sin costos durante la hackathon.
- Supabase elimina horas de configuración de autenticación, base de datos y storage.
- Vercel genera una URL real para que los jueces puedan usar el prototipo en vivo.
- Next.js tiene documentación extensa, menos tiempo perdido buscando soluciones.

---

## 9. Requisitos No Funcionales

| Requisito | Detalle |
|---|---|
| **Accesibilidad** | Interfaz simple, íconos claros, texto grande, bajo nivel de lectura requerido |
| **Responsivo** | Funciona en celular, tablet y computadora |
| **Idiomas** | Español y Quechua (selección al inicio, mensajes críticos en ambos idiomas) |
| **Privacidad** | Cumplimiento Ley N.° 29733. Sin acceso a historias clínicas reales. Datos anonimizables. |
| **Interoperabilidad** | Diseñado para integración futura con sistemas del INEN, sin requerirla en esta etapa |
| **Disponibilidad** | Web accesible desde cualquier dispositivo con navegador |

---

## 10. Fuera del Alcance (para la Hackatón)

- Integración real con sistemas HIS/SIS del INEN.
- IA clínica o diagnóstico automático.
- Historia clínica electrónica completa.
- Pago de citas en línea.
- Videollamada con asistenta social.
- Tablets físicas en el establecimiento (escalamiento futuro).
- Traducción completa al quechua (solo mensajes críticos en esta etapa).

---

## 11. Modelo de Implementación Futura (post-hackathon)

El INEN podría lanzar un piloto en 3 meses con:
- WhatsApp Business API (costo inicial ~$0).
- Web hosteada en infraestructura de la PCM o nube pública.
- 50 pacientes piloto en el servicio de mama y cérvix.
- 2 asistentas sociales como navegadoras digitales.
- Sin tocar sistemas legacy del hospital en la fase inicial.

---

## 12. Entregables para la Hackatón

| Entregable | Descripción |
|---|---|
| Prototipo web navegable | Mockup HTML clickeable con flujo de paciente y admin |
| Flujo del chatbot | Árbol de conversación del bot de WhatsApp |
| Presentación del pitch | Historia de paciente + arquitectura + propuesta de piloto |
| Documento técnico | Arquitectura conceptual y modelo de datos básico |
