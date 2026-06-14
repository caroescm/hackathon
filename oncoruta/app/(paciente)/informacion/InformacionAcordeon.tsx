"use client";

import { useState } from "react";
import {
  ChevronDown,
  Route,
  CalendarDays,
  Stethoscope,
  Pill,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

// ─── Mini timeline ──────────────────────────────────────────────────────────

function MiniTimeline({ idioma }: { idioma: string }) {
  const pasos = idioma === "es"
    ? [{ n: 1, label: "Preparación" }, { n: 2, label: "Registro" }, { n: 3, label: "Consulta" }, { n: 4, label: "Exámenes" }, { n: 5, label: "Resultado" }]
    : [{ n: 1, label: "Allichakuy" }, { n: 2, label: "Yaykuy" }, { n: 3, label: "Tapukuy" }, { n: 4, label: "Llanachiy" }, { n: 5, label: "Tariy" }];

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2 -mx-1 px-1">
      {pasos.map((p, i) => (
        <div key={p.n} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center gap-1 w-16">
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-xs font-bold text-blue-700">
              {p.n}
            </div>
            <span className="text-[10px] text-center text-gray-500 dark:text-slate-400 leading-tight">{p.label}</span>
          </div>
          {i < pasos.length - 1 && <div className="w-6 h-px bg-blue-200 mb-4 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// ─── FAQ sub-acordeón ──────────────────────────────────────────────────────

const FAQS_ES = [
  { q: "¿Cuánto cuesta la atención en el INEN?", a: "La atención puede ser gratuita si tienes SIS. Si no tienes seguro, el área de Trabajo Social del INEN aplica una clasificación socioeconómica que puede reducir o eximir el costo. Pregunta por Trabajo Social cuando llegues." },
  { q: "¿Puedo venir sin referencia médica?", a: "Para ser atendida por primera vez en el INEN generalmente necesitas una hoja de referencia de tu centro de salud u hospital de origen. Consulta directamente con admisión al llegar." },
  { q: "¿Cuánto tiempo tengo que esperar para mi primera cita?", a: "El tiempo varía según la urgencia de tu caso. Puede ser de unos días a varias semanas. Si tu situación es urgente, el médico que te refirió puede indicar prioridad en la documentación." },
  { q: "¿El cáncer de seno tiene cura?", a: "Sí, especialmente cuando se detecta en etapas tempranas. Las tasas de supervivencia han mejorado mucho en las últimas décadas. El diagnóstico oportuno hace una gran diferencia." },
  { q: "¿Puedo seguir trabajando durante el tratamiento?", a: "Depende del tipo de tratamiento. Muchas pacientes continúan trabajando durante radioterapia u hormonoterapia. La quimioterapia puede ser más intensa. Tu equipo médico te orientará según tu caso." },
  { q: "¿La quimioterapia siempre hace caer el cabello?", a: "No siempre. Depende del tipo y dosis de quimioterapia. Tu oncólogo te explicará qué esperar. La caída es temporal — el cabello vuelve a crecer después del tratamiento." },
  { q: "¿Qué pasa si no puedo pagar los medicamentos?", a: "El INEN tiene programas de apoyo y trabaja con el SIS para cubrir medicamentos esenciales. El área de Trabajo Social puede orientarte sobre fondos de ayuda. No dejes un tratamiento por razones económicas sin consultar primero." },
  { q: "¿Puedo traer a un familiar a mis citas?", a: "Sí, y se recomienda. Tener a alguien de confianza te ayuda a recordar lo que dice el médico y te brinda apoyo emocional. Tu acompañante puede entrar contigo a la consulta salvo indicación contraria." },
  { q: "¿Cuándo debo ir a emergencias del INEN?", a: "Ve a emergencias de inmediato si tienes fiebre mayor a 38°C, sangrado que no cede, sangre en la orina, dificultad para respirar o pérdida del conocimiento. Llama al (01) 201-6000." },
  { q: "¿Cómo cuido mi alimentación durante el tratamiento?", a: "Prioriza proteínas, frutas y verduras cocidas, y bebe suficiente agua. Si tienes náuseas, come en porciones pequeñas y frecuentes. Evita alimentos crudos cuando tus defensas estén bajas. Solicita una consulta de nutrición oncológica en el INEN." },
];

const FAQS_QU = [
  { q: "¿INEN-pi atinchu mana pagaspa?", a: "SIS kasqaykiwan mana pagasqachu kanki. Mana seguruyki kaptinqa, Trabajo Social-pi tapukuy — yanapasunkiku." },
  { q: "¿38°C aswan rupaptiy, ima runayman rinay?", a: "Usqhaym INEN-pi emergencias-man ri. (01) 201-6000 waqyay. Mana suyaychu." },
  { q: "¿Chukcha urmaptinmi kutimunqachu?", a: "Arí — hampiy tukuptinki, 4–6 simanamanta kutimunqa. Mana wiñaypaqchu." },
];

type FaqItem = { q: string; a: string };

function FaqAccordion({ faqs, idioma }: { faqs: FaqItem[]; idioma: string }) {
  const [openI, setOpenI] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenI(prev => prev === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-slate-100 leading-snug">{faq.q}</span>
            <ChevronDown
              size={15}
              className={`flex-shrink-0 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${openI === i ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openI === i ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
      {idioma === "qu" && (
        <div className="mt-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Beta</span> — Aswan tapukuykuna español simipin — traducción quechua chanka allichakuchkaptinraqmi.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Contenidos de categoría ──────────────────────────────────────────────

function Cat1Content({ idioma }: { idioma: string }) {
  return (
    <div className="space-y-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
      <MiniTimeline idioma={idioma} />
      {idioma === "es" ? (
        <>
          <p>Antes de tu primera visita al INEN necesitas reunir tus documentos: DNI original, hoja de referencia de tu centro de salud u hospital de origen, y resultados de exámenes previos si tienes. Sin la hoja de referencia, es difícil ser atendida en la primera visita.</p>
          <p>Al llegar, pasas por admisión para registrarte. El personal revisa tus documentos y, si cumples los criterios, abre tu historia clínica y te asigna una primera cita con el especialista. Ese trámite puede tomar entre uno y dos días hábiles.</p>
          <p>En tu primera consulta oncológica, el médico te examina y te indica qué exámenes necesitas — puede ser una mamografía, ecografía, colposcopía o biopsia. Los resultados demoran entre una y cuatro semanas según el tipo de examen.</p>
          <p>Finalmente, el médico te cita para explicarte el resultado. Si se confirma un diagnóstico, ese mismo día se define el plan de tratamiento.</p>
        </>
      ) : (
        <>
          <p>INEN-man ñawpaq hamunankipaq, qillqaykikunata tantachiy: DNI, qillqa kachasqa hampiq wasimanta, llanachiy tarisqaykuna kanman.</p>
          <p>Chayaptinki, yaykuyman rinki. Runakuna qillqaykikunata qhawanku. Allinmi kaptinki, kawsay qillqaykita kichanku, tapukuyniykitaqmi nisunkiku.</p>
          <p>Ñawpaq tapukuykipi, hampiqmi qhawasunki, imatam llanachisqayki nisunki — mamografía, ecografía, colposcopía icha biopsia kanman. Tarisqakuna 1–4 simanamanta sayaykamunqa.</p>
          <p>Tukuypitaq, hampiqmi waqyasunki tarisqaykita willanaykipaq. Unquy kasqanta tariptinku, chay p'unchayllapitaqmi hampiy ñanniykita nisunkiku.</p>
        </>
      )}
    </div>
  );
}

function Cat2Content({ idioma }: { idioma: string }) {
  return (
    <div className="space-y-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
      {idioma === "es" ? (
        <>
          <p>Para cualquier cita en el INEN, lleva siempre tu DNI original. Si tienes SIS, ESSALUD u otro seguro, lleva también ese carnet. Trae todos los exámenes, ecografías, mamografías o biopsias que hayas hecho antes — aunque sean de otro hospital.</p>
          <p>Si es tu primera vez, lleva la hoja de referencia de tu centro de salud de origen. Sin ella, el proceso de admisión puede complicarse. Si ya eres paciente del INEN, lleva tu carnet de historia clínica y cualquier resultado nuevo que tengas.</p>
          <p>Llega con al menos una hora de anticipación, especialmente si tu cita es en las mañanas. Traer algo de comer y beber te ayudará a esperar con más comodidad.</p>
          <p>Ven acompañada si puedes. Tener a alguien de confianza te ayuda a recordar lo que el médico te dice. Antes de tu cita, escribe tus preguntas en un papel o en tu celular para no olvidarlas durante la consulta.</p>
        </>
      ) : (
        <>
          <p>Sapa tapukuyman rinankipaq, DNI, SIS qillqa icha huk seguro apamuy. Huk wasi llanachisqaykitapas apamuy — INEN-pi manachus rurasqachu kaptinpas.</p>
          <p>Ñawpaq kutikipim hampiq wasimanta qillqa kachasqata apamuy. Chay qillqa mana kasqanki, yaykuyman rinki siqiminqa sasam kanqa. Ña INEN-pi kasqaykipim, kawsay qillqa kartaykita apamuy.</p>
          <p>Siq'i hourkunam ñawpaqta chayamuy, amataq saqiychu — INEN-pi achkha runakuna kachkan. Mikhuyta upyaytawan apamuy suyanaykipaq.</p>
          <p>Apaykachawaqniyoq hamuy. Paymi yanapasunki hampiq nisqankunata yuyarinaykipaq. Tapukuyniykunata ñawpaqmantam qillqakuy, tapukuykipi mana qonqanaykipaq.</p>
        </>
      )}
    </div>
  );
}

function Cat3Content({ idioma }: { idioma: string }) {
  return (
    <div className="space-y-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Mamografía</p>
        <p className="text-blue-700 dark:text-blue-300">
          {idioma === "es"
            ? "Es una radiografía especial de los senos. Dura entre 15 y 20 minutos. Puede haber algo de presión o incomodidad, pero no es dolorosa para la mayoría. No uses desodorante, cremas ni talco ese día."
            : "Ukhu pechomanta radiografía nisqa. 15–20 minutom. Uchuylla ñak'ariymi kanman — mana nanasqachu. Chay p'unchayim mana desodorante ni crema churakuychu."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
        <p className="font-semibold text-green-800 dark:text-green-300 mb-2">Ecografía</p>
        <p className="text-green-700 dark:text-green-300">
          {idioma === "es"
            ? "Usa ondas de sonido para crear imágenes. Se aplica un gel frío y se pasa un transductor suavemente. No emite radiación, no duele y tarda entre 20 y 30 minutos. No requiere preparación especial."
            : "Sonido phututawan imagen ruranam. Frío gel churanku, transductor suave pasaynin. Mana radiación, mana nanasqa, 20–30 minutom. Mana ima allichakuychu."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
        <p className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Colposcopía</p>
        <p className="text-purple-700 dark:text-purple-300">
          {idioma === "es"
            ? "Es una revisión del cuello uterino con un aparato especial llamado colposcopio, como una lupa de alta potencia. Puede haber una ligera molestia, similar a un Papanicolaou. Dura entre 15 y 30 minutos."
            : "Qosqo sikinmanta colposcopio nisqawan qhawanakum — hatun lupapa hina. Uchuy molestia kanman. 15–30 minutom."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
        <p className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Biopsia</p>
        <p className="text-orange-700 dark:text-orange-300">
          {idioma === "es"
            ? "Se toma una pequeña muestra de tejido para analizarla en el laboratorio. El médico aplica anestesia local, por lo que no sientes dolor durante la extracción. Los resultados suelen tardar entre 1 y 3 semanas."
            : "Uchuy aycha muestra laboratoriopin qhawanankupaqm. Hampiqmi anestesia local churan, mana nanasqachu. Tarisqakuna 1–3 simanamanta sayaykamunqa."}
        </p>
      </div>
    </div>
  );
}

function Cat4Content({ idioma }: { idioma: string }) {
  return (
    <div className="space-y-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
      <p>
        {idioma === "es"
          ? "El tratamiento que se indica depende del tipo de cáncer, la etapa y las características de tu caso. En muchas situaciones se combinan varios tipos. Tu oncólogo te explicará con detalle cuál es el plan para ti."
          : "Hampiy ñanqa onqoy rikch'aqmanta, estadiomanta, qanmanta hinallataqmi. Achkha kutim huñusqam. Hampiqniykim willasuniki."}
      </p>
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{idioma === "es" ? "Cirugía" : "Cirugía / Operación"}</p>
        <p className="text-blue-700 dark:text-blue-300">
          {idioma === "es"
            ? "Se opera para retirar el tumor. Puede ser una tumorectomía (solo el tumor) o una mastectomía (todo el seno). La cirugía no siempre es el primer paso — a veces se indica quimioterapia antes para reducir el tumor."
            : "Operacionpi tumorm orqonkiku. Uchuylla operación (tumorectomía) icha llapan pecho (mastectomía) kanman. Mana ñawpaqchus — mayniqpin quimioterapia ñawpaqtan."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
        <p className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Quimioterapia</p>
        <p className="text-purple-700 dark:text-purple-300">
          {idioma === "es"
            ? "Son medicamentos que destruyen las células cancerosas. Se aplican en ciclos con períodos de descanso. Puede causar cansancio, náuseas o caída del cabello — efectos que mejoran al terminar el tratamiento."
            : "Onqoy wañuchiq hampikuna. Ciclos nisqapin churanku, samaykuywantaq. Chukcha urmananmi, qonqaymi, suqiymi — tukuytawan allinyanqam."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
        <p className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Radioterapia</p>
        <p className="text-orange-700 dark:text-orange-300">
          {idioma === "es"
            ? "Usa rayos de alta energía para destruir células cancerosas en una zona específica. Las sesiones son cortas y no duelen durante la aplicación. La piel puede irritarse hacia el final del tratamiento."
            : "Hatun energía rayoswan onqoy wañuchin. Sesionkuna utqaylla, mana nanasqa. Qara irritakunanmi tukuyman."}
        </p>
      </div>
      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
        <p className="font-semibold text-green-800 dark:text-green-300 mb-2">Hormonoterapia</p>
        <p className="text-green-700 dark:text-green-300">
          {idioma === "es"
            ? "Son pastillas o inyecciones que bloquean las hormonas que alimentan ciertos tipos de tumor. Generalmente se toma por varios años después del tratamiento principal. Los efectos secundarios suelen ser leves."
            : "Pastilla icha inyección nisqam hormonata suyunkunakuq. Achkha watam tomanki, hampiy tukuytawan. Efectokuna uchuylla."}
        </p>
      </div>
    </div>
  );
}

function Cat5Content({ idioma }: { idioma: string }) {
  return (
    <div className="space-y-5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
      {idioma === "es" ? (
        <>
          <p>Durante el tratamiento, tu cuerpo pasa por cambios importantes. Conocerlos de antemano te ayuda a manejarlos mejor y a saber cuándo necesitas llamar a tu médico.</p>
          <p><span className="font-semibold text-gray-800">Semana 2 después de la quimioterapia:</span> Es el momento en que tus defensas están más bajas. Evita lugares muy concurridos, lávate las manos con frecuencia y mantente alejada de personas con gripe o infecciones. No comas alimentos crudos ni poco cocidos.</p>
          <p><span className="font-semibold text-gray-800">Náuseas y vómitos:</span> Come en porciones pequeñas y frecuentes. Los alimentos fríos o a temperatura ambiente suelen tolerarse mejor. Tu médico puede recetarte medicamentos para las náuseas.</p>
          <p><span className="font-semibold text-gray-800">Diarrea o estreñimiento:</span> Bebe mucho líquido. Si tienes diarrea, evita fibra cruda y grasas. Si tienes estreñimiento, aumenta frutas cocidas, menestras y camina un poco. Avisa a tu equipo médico si dura más de dos días.</p>
          <p><span className="font-semibold text-gray-800">Fatiga:</span> Es el efecto secundario más común. Descansa cuando lo necesites. Caminar 15 a 20 minutos al día puede ayudar a reducir el cansancio.</p>
          <p><span className="font-semibold text-gray-800">Mucositis (llagas en la boca):</span> Enjuágate con agua tibia con sal varias veces al día. Usa cepillo suave. Evita alimentos picantes, ácidos o muy calientes.</p>
          <p><span className="font-semibold text-gray-800">Caída del cabello:</span> Si tu tratamiento la causa, el cabello suele empezar a caer entre la segunda y cuarta semana. Es temporal — vuelve a crecer después. El INEN tiene psicología oncológica para acompañarte.</p>
        </>
      ) : (
        <>
          <p>Hampiy watakunapin, cuerpuyki cambiakushanmi. Yachaspa allinmi — hampiqniykita waqyanayki kasqanta riqsinki.</p>
          <p><span className="font-semibold text-gray-800">Quimioterapia qepaq 2do simanapi:</span> Chay p'unchaykunapin defensakuna uchuyllam. Achkha runakunasqa wasikunata mana riychu. Makinata maylliy. Crudo mikhuyta mana mikuychu.</p>
          <p><span className="font-semibold text-gray-800">Qonqay / suwiy:</span> Uchuy porciones sapa ratom mikuspa. Frío icha temperatura normal mikhunam allinraqmi. Hampiqniykita nin antiemético munaptinki.</p>
          <p><span className="font-semibold text-gray-800">Juk'uy / estreñimiento:</span> Achkha yakuta upyay. Juk'uy kaptinki, crudo mikhuytam mana mikuychu. Estreñimiento kaptinki, ch'uñu, menestras, puriytam camina. 2 p'unchaymanta aswan kasqanki, hampiqnikita willay.</p>
          <p><span className="font-semibold text-gray-800">Qonqa sonqo:</span> Aswan contasqa efectom. Samaykuy. 15–20 minutom sapa p'unchay puriymi yanapan.</p>
          <p><span className="font-semibold text-gray-800">Simin qhesqo (mucositis):</span> Cachi yakuwanmi kachkiykuy sapa ratom. Suave cepillo. Picante, agrio, ruphaq mikhuyta mana mikuychu.</p>
          <p><span className="font-semibold text-gray-800">Chukcha urmay:</span> Hampikuna chukchata urmanmi. 2–4 simanamanta qallarim. Mana wiñaypaqchu — tukuytawan kutimunqa. INEN-pi psicología oncológica yanapasunki.</p>
        </>
      )}
    </div>
  );
}

function Cat6Content({ idioma }: { idioma: string }) {
  const faqs = idioma === "es" ? FAQS_ES : [...FAQS_QU, ...FAQS_ES.slice(3)];
  return <FaqAccordion faqs={faqs} idioma={idioma} />;
}

// ─── Acordeón principal ───────────────────────────────────────────────────

function AcordeonItem({
  titulo, descripcion, icon, content, isOpen, onToggle,
}: {
  titulo: string; descripcion: string; icon: React.ReactNode; content: React.ReactNode;
  isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-blue-200 dark:border-blue-700 shadow-sm" : "border-gray-200 dark:border-slate-700"}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${isOpen ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"}`}
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-tight ${isOpen ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-slate-100"}`}>
            {titulo}
          </p>
          {!isOpen && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{descripcion}</p>}
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : "text-gray-400 dark:text-slate-500"}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 py-5 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function InformacionAcordeon() {
  const { t, idioma } = useIdioma();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const CATS = [
    { titulo: t.cat1Titulo, desc: t.cat1Desc, icon: <Route size={16} />,        content: <Cat1Content idioma={idioma} /> },
    { titulo: t.cat2Titulo, desc: t.cat2Desc, icon: <CalendarDays size={16} />, content: <Cat2Content idioma={idioma} /> },
    { titulo: t.cat3Titulo, desc: t.cat3Desc, icon: <Stethoscope size={16} />,  content: <Cat3Content idioma={idioma} /> },
    { titulo: t.cat4Titulo, desc: t.cat4Desc, icon: <Pill size={16} />,         content: <Cat4Content idioma={idioma} /> },
    { titulo: t.cat5Titulo, desc: t.cat5Desc, icon: <ShieldCheck size={16} />,  content: <Cat5Content idioma={idioma} /> },
    { titulo: t.cat6Titulo, desc: t.cat6Desc, icon: <HelpCircle size={16} />,   content: <Cat6Content idioma={idioma} /> },
  ];

  return (
    <div className="space-y-3">
      {CATS.map((cat, i) => (
        <AcordeonItem
          key={i}
          titulo={cat.titulo}
          descripcion={cat.desc}
          icon={cat.icon}
          content={cat.content}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(prev => prev === i ? null : i)}
        />
      ))}
    </div>
  );
}
