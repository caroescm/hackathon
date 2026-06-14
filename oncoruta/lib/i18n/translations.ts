export type Idioma = "es" | "qu";

const translations = {
  es: {
    // Nav / Sidebar
    inicio: "Inicio",
    misProceso: "Mi Proceso",
    misCitas: "Mis Citas",
    misDocumentos: "Mis Documentos",
    informacion: "Información",
    configuracion: "Configuración",
    cerrarSesion: "Cerrar sesión",
    consultas: "Consultas",

    // Dashboard
    holaPaciente: (nombre: string) => `Hola, ${nombre}`,
    subtitleDashboard: "Aquí tienes un resumen de tu proceso",
    proximaCita: "Próxima cita",
    sinCitas: "Sin citas programadas",
    documentos: "Documentos",
    archivosSubidos: "archivos subidos",
    etapaActual: "Etapa actual",
    enCurso: "En curso",
    miProcesoTratamiento: "Mi Proceso de Tratamiento",
    proximasCitas: "Próximas Citas",
    noHayCitas: "No tienes citas programadas.",
    noEtapas: "No se encontraron etapas de tratamiento.",

    // Estados
    completado: "Completado",
    pendiente: "Pendiente",
    enviado: "Enviado",
    enRevision: "En revisión",
    aprobado: "Aprobado",
    rechazado: "Rechazado",

    // Proceso
    tituloRoadmap: "Mi Proceso",
    subtitleRoadmap: "Seguimiento de tu atención en el INEN",
    etapasTratamiento: "Etapas de tu atención",
    descripcionRoadmap: "Tu recorrido personalizado en el INEN",
    sinProceso: "Tu proceso aún no ha sido configurado. Contacta a la asistenta social.",

    // Pasos — Sospecha
    paso0Nombre: "Preparación",
    paso0Desc: "Reúne tus documentos antes de venir al INEN",
    paso0Info: "Necesitas: DNI, hoja de referencia de tu centro de salud, resultados de exámenes previos si tienes.",
    paso0Tiempo: "Antes de tu primera visita",

    paso1Nombre: "Admisión y evaluación",
    paso1Desc: "Presentas tus documentos y te evalúan",
    paso1Info: "El personal revisa si cumples los criterios de admisión. Trae todos tus documentos originales.",
    paso1Tiempo: "1–2 días",

    paso2Nombre: "Apertura de historia clínica",
    paso2Desc: "Te asignan tu primera cita con el especialista",
    paso2Info: "Se abre tu historia clínica y recibes la fecha de tu primera consulta oncológica.",
    paso2Tiempo: "1 semana aproximadamente",

    paso3Nombre: "Primera consulta",
    paso3Desc: "Te evalúa el médico oncólogo",
    paso3Info: "El especialista te examina y te indica qué exámenes necesitas. Es normal sentir nervios — puedes venir acompañada.",
    paso3Tiempo: "1–2 semanas",

    paso4Nombre: "Exámenes de diagnóstico",
    paso4Desc: "Mamografía, ecografía, colposcopía o biopsia",
    paso4Info: "Según tu caso, te harán uno o más exámenes. Los resultados demoran entre 1 y 3 semanas.",
    paso4Tiempo: "2–4 semanas",

    paso5Nombre: "Resultado y diagnóstico",
    paso5Desc: "Recibes tu diagnóstico definitivo",
    paso5Info: "El médico te explica el resultado. Si se confirma cáncer, se define el tratamiento a seguir.",
    paso5Tiempo: "1 semana",

    // Pasos — Preventivo
    prevPaso1Nombre: "Agendar examen preventivo",
    prevPaso1Desc: "Solicita tu cita de control",
    prevPaso1Info: "Necesitas: DNI y carnet SIS. El examen es gratuito con SIS.",
    prevPaso1Tiempo: "Mismo día o a la semana",

    prevPaso2Nombre: "Examen preventivo",
    prevPaso2Desc: "Mamografía o Papanicolaou",
    prevPaso2Info: "El examen dura aproximadamente 30 minutos. No necesitas preparación especial.",
    prevPaso2Tiempo: "30 minutos",

    prevPaso3Nombre: "Resultado y seguimiento",
    prevPaso3Desc: "Recibes tu resultado",
    prevPaso3Info: "Si todo está bien, tu próximo control es en 1–2 años. Si hay algo que revisar, te indicarán los siguientes pasos.",
    prevPaso3Tiempo: "1–2 semanas",

    // Pasos — Diagnosticado
    diagPaso1Nombre: "Plan de tratamiento",
    diagPaso1Desc: "El médico define tu tratamiento",
    diagPaso1Info: "Puede ser cirugía, quimioterapia, radioterapia o una combinación. El oncólogo te explicará cada opción.",
    diagPaso1Tiempo: "1 semana",

    diagPaso2Nombre: "Tratamiento activo",
    diagPaso2Desc: "Recibes tu tratamiento",
    diagPaso2Info: "Sigue las indicaciones del médico. Sube tus resultados de análisis antes de cada sesión. Si tienes fiebre mayor a 38°C, ve a emergencias de inmediato.",
    diagPaso2Tiempo: "Varía según el caso",

    diagPaso3Nombre: "Control y seguimiento",
    diagPaso3Desc: "Citas de control periódicas",
    diagPaso3Info: "Después del tratamiento, tendrás controles regulares para monitorear tu recuperación.",
    diagPaso3Tiempo: "Cada 3–6 meses",

    diagPaso4Nombre: "Alta o mantenimiento",
    diagPaso4Desc: "Fin del tratamiento activo",
    diagPaso4Info: "Cuando el tratamiento termina, continúas con controles. El equipo del INEN seguirá acompañándote.",
    diagPaso4Tiempo: "Según indicación médica",

    // Información — categorías
    infoTitulo: "Información",
    infoSubtitle: "Todo lo que necesitas saber sobre tu atención en el INEN",
    cat1Titulo: "El proceso diagnóstico",
    cat1Desc: "Los pasos de tu atención en el INEN",
    cat2Titulo: "Antes de tu cita",
    cat2Desc: "Qué llevar y cómo prepararte",
    cat3Titulo: "Los exámenes",
    cat3Desc: "Qué esperar en cada examen",
    cat4Titulo: "Si te indican tratamiento",
    cat4Desc: "Tipos de tratamiento y qué esperar",
    cat5Titulo: "Cuidados durante el tratamiento",
    cat5Desc: "Cómo cuidarte en casa",
    cat6Titulo: "Preguntas frecuentes",
    cat6Desc: "Respuestas a tus dudas más comunes",

    // Alertas de emergencia
    alertaEmergencia: "⚠️ Ve a emergencias si tienes: fiebre mayor a 38°C, sangrado que no para, o sangre en la orina.",

    // Chatbot
    chatBienvenida: "Hola, estoy aquí para acompañarte en cada paso de tu proceso en el INEN. Puedes preguntarme lo que necesites — estoy para ayudarte. 💙",
    chatPlaceholder: "Escribe tu mensaje...",
    chatNombreAsistente: "Asistente INEN",
    chatEnLinea: "En línea",

    // Documentos
    subirDocumento: "Subir documento",
    sinDocumentos: "Aún no has subido documentos.",
    misDocumentosTitulo: "Mis Documentos",
    misDocumentosSubtitle: "Historial médico y resultados",

    // Citas
    misCitasTitulo: "Mis Citas",
    misCitasSubtitle: "Agenda médica en el INEN",
    solicitarCita: "Solicitar cita",
    proximasCitasTitulo: "Próximas Citas",
    citasAnteriores: "Citas Anteriores",
    sinProxCitas: "No tienes citas próximas programadas.",

    // Registro
    tipoSospecha: "Tengo sospecha de cáncer",
    tipoPreventivo: "Vengo a un chequeo preventivo",
    tipoDiagnosticado: "Ya tengo un diagnóstico",
    tuSituacion: "¿Cuál es tu situación?",

    // Disclaimer quechua
    disclaimerQuechua: "",
  },

  qu: {
    // Nav / Sidebar
    inicio: "Qallariy",
    misProceso: "Ñanniymi",
    misCitas: "Tupanakuykuna",
    misDocumentos: "Qillqakuna",
    informacion: "Willay",
    configuracion: "Churay",
    cerrarSesion: "Llojsiy",
    consultas: "Tapukuykuna",

    // Dashboard
    holaPaciente: (nombre: string) => `Rimaykullayki, ${nombre}`,
    subtitleDashboard: "Kaypim tarikun kawsay ñanniykimanta",
    proximaCita: "Qatiq tupanakuy",
    sinCitas: "Mana tupanakuyniykichu",
    documentos: "Qillqakuna",
    archivosSubidos: "qillqa apachisqa",
    etapaActual: "Kunan ñan",
    enCurso: "Kunanmi",
    miProcesoTratamiento: "Ñanniymi INEN-pi",
    proximasCitas: "Qatiq Tupanakuykuna",
    noHayCitas: "Mana tupanakuyniykichu.",
    noEtapas: "Mana ñanniykichu tarikun.",

    // Estados
    completado: "Tukusqaña",
    pendiente: "Manaranmi",
    enviado: "Kachasqaña",
    enRevision: "Qhawashaykuña",
    aprobado: "Allinmi",
    rechazado: "Mana allinchu",

    // Proceso
    tituloRoadmap: "Ñanniymi",
    subtitleRoadmap: "INEN-pi qhawarisqayki",
    etapasTratamiento: "Ñanniykimanta rikch'akuykuna",
    descripcionRoadmap: "Qanpaqmi kachkan kay ñan INEN-pi",
    sinProceso: "Ñanniyki manaranmi churasqachu. Yanapaqwanmi rimay.",

    // Pasos — Sospecha
    paso0Nombre: "Allichakuy",
    paso0Desc: "Qillqaykikunata tantachiy INEN-man shamunankipaq",
    paso0Info: "Munasqayki: DNI, qillqa qosqa hampiq wasimanta, ñawpaq tarisqayki.",
    paso0Tiempo: "Ñawpaq shamunaykimantam",

    paso1Nombre: "Yaykuy",
    paso1Desc: "Qillqaykikunata qoy, qhawarisunkitaqmi",
    paso1Info: "Runakunam qhawan allinchakunaykipaqchu. Lliw qillqaykikunata apamuy.",
    paso1Tiempo: "1–2 p'unchay",

    paso2Nombre: "Qillqa kichay",
    paso2Desc: "Ñawpaq tupanakuyniyki qosunkim",
    paso2Info: "Kawsay qillqayki kichasqam. Ñawpaq tupanakuyniykimanta willasunkim.",
    paso2Tiempo: "1 simana hinallatam",

    paso3Nombre: "Ñawpaq tapukuy",
    paso3Desc: "Hampiqmi qhawasunki",
    paso3Info: "Hampiqmi qhawasunki, imatam llanachisqayki nisunki. Allinmi apaykachawaqniyoq hamunayki.",
    paso3Tiempo: "1–2 simana",

    paso4Nombre: "Llanachiy",
    paso4Desc: "Mamografía, ecografía, biopsia",
    paso4Info: "Qanpaq hinallatam llanachinkiku. Tarisqaykukunam 1–3 simanamanta sayaykamunqa.",
    paso4Tiempo: "2–4 simana",

    paso5Nombre: "Tarisqa willay",
    paso5Desc: "Unquyniykimanta willasunkim",
    paso5Info: "Hampiqmi willasuniki imatam tarirqanki. Hampiy ñanniykitam nisunki.",
    paso5Tiempo: "1 simana",

    // Pasos — Preventivo
    prevPaso1Nombre: "Qhawarisqa tupanakuy mañay",
    prevPaso1Desc: "Manapunitaq unquyniykichu kaptinqa",
    prevPaso1Info: "Munasqayki: DNI, SIS qillqa. SIS-wan mana pagasqachu.",
    prevPaso1Tiempo: "P'unchaylla icha simanapi",

    prevPaso2Nombre: "Qhawarisqa llanachiy",
    prevPaso2Desc: "Mamografía icha Papanicolaou",
    prevPaso2Info: "Llanachiykunam 30 minutullam. Mana ima allichakuychu munasqa.",
    prevPaso2Tiempo: "30 minuto",

    prevPaso3Nombre: "Tarisqa willay",
    prevPaso3Desc: "Tarisqaykikunam willasuniki",
    prevPaso3Info: "Allinmi kaptinqa, 1–2 watamantam kutimunki. Ima qhawananku kaptinqa, qatiq ñanniykita nisunkim.",
    prevPaso3Tiempo: "1–2 simana",

    // Pasos — Diagnosticado
    diagPaso1Nombre: "Hampiy ñan",
    diagPaso1Desc: "Hampiqmi hampiy ñanniykita nisunki",
    diagPaso1Info: "Cirugiá, quimioterapia, radioterapia icha huñusqam kanan. Hampiqmi sapa kimsa willasunki.",
    diagPaso1Tiempo: "1 simana",

    diagPaso2Nombre: "Hampiy",
    diagPaso2Desc: "Hampiyniykita chaskinki",
    diagPaso2Info: "Hampiqpa nisqantan ruway. Sapa sesión ñaupaq yawar llanachiyniykita apamuy. 38°C aswan rupaptinki, usqhaym hampiq wasiman ri.",
    diagPaso2Tiempo: "Qanpaq hinallatam",

    diagPaso3Nombre: "Qhawakuy",
    diagPaso3Desc: "Qhatiqmanta tupanakuykuna",
    diagPaso3Info: "Hampiyta tukuytawan, qhawakuyta sayaykamunki. INEN-manta runakunam qatiqmantapas apaykachasunkiku.",
    diagPaso3Tiempo: "3–6 killapi sapa kutim",

    diagPaso4Nombre: "Tukuy",
    diagPaso4Desc: "Hampiy tukun",
    diagPaso4Info: "Hampiyta tukuptinki, qhawakuywanraqmi katinki. INEN-manta runakuna qatiqmantapas yanasunkiku.",
    diagPaso4Tiempo: "Hampiqpa nisqanman hinam",

    // Información — categorías
    infoTitulo: "Willay",
    infoSubtitle: "INEN-pi qhawarisunaykipaq yachananki",
    cat1Titulo: "Hampiy ñan",
    cat1Desc: "INEN-pi ñanniykimanta",
    cat2Titulo: "Tupanakuy ñaupaq",
    cat2Desc: "Imatam apamuy, imaynamtam allichakuy",
    cat3Titulo: "Llanachiy",
    cat3Desc: "Sapa llanachiypi imatatam suyakunki",
    cat4Titulo: "Hampiy nisuptinki",
    cat4Desc: "Hampiy ñankuna",
    cat5Titulo: "Hampiy watakunapi qhawarikuy",
    cat5Desc: "Wasiykipi imaynamta qhawarikuy",
    cat6Titulo: "Tapukuykuna",
    cat6Desc: "Tapukuyniykimanta kutipay",

    // Alertas de emergencia
    alertaEmergencia: "⚠️ Usqhaym hampiq wasiman ri: 38°C aswan rupaptinki, yawar mana tiyarikuptinki, icha mimillaykipi yawar rikuriptinki.",

    // Chatbot
    chatBienvenida: "Rimaykullayki, INEN-pi sapa ñanniykipi yanasunki kani. Tapukuyniykikunata nisqaykipi — yanapasunki kani. 💙",
    chatPlaceholder: "Rimayniykita qaway...",
    chatNombreAsistente: "INEN Yanapaq",
    chatEnLinea: "Kachkam",

    // Documentos
    subirDocumento: "Qillqa apachiy",
    sinDocumentos: "Manaranmi qillqa apachisqachu kanki.",
    misDocumentosTitulo: "Qillqakuna",
    misDocumentosSubtitle: "Hampiy qillqakunayki",

    // Citas
    misCitasTitulo: "Tupanakuykuna",
    misCitasSubtitle: "INEN-pi tupanakuyniykikuna",
    solicitarCita: "Tupanakuy mañay",
    proximasCitasTitulo: "Qatiq Tupanakuykuna",
    citasAnteriores: "Ñawpaq Tupanakuykuna",
    sinProxCitas: "Mana qatiq tupanakuyniykichu.",

    // Registro
    tipoSospecha: "Unqusqa kanmi ninku",
    tipoPreventivo: "Qhawarisqalla shamunikim",
    tipoDiagnosticado: "Yachasqañam unquyniyta",
    tuSituacion: "¿Ima hinallatam kanki?",

    // Disclaimer
    disclaimerQuechua: "Traducción al quechua chanka en revisión por hablantes nativos.",
  },
} as const;

export default translations;
