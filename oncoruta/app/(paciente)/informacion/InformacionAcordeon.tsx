"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Item = {
  numero: number;
  titulo: string;
  icono: string;
  contenido: React.ReactNode;
};

const PASOS: Item[] = [
  {
    numero: 1,
    titulo: "Admisión y Registro",
    icono: "📋",
    contenido: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Qué documentos debes traer?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>DNI original (y copia)</li>
            <li>Hoja de referencia del hospital o centro de salud de origen</li>
            <li>Resultados de exámenes previos (ecografías, mamografías, biopsias)</li>
            <li>Carnet del SIS, ESSALUD u otro seguro si tienes</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Qué pasa ese día?</p>
          <p>Cuando llegues al INEN, primero pasas por admisión para registrarte. Te asignarán un número de historia clínica y te indicarán a qué consultorio ir según tu caso.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Tiempos de espera</p>
          <p>El tiempo de espera puede variar entre <span className="font-medium text-gray-700">1 a 3 horas</span>. Te recomendamos llegar temprano, traer algo de comer y venir acompañada si puedes.</p>
        </div>
      </div>
    ),
  },
  {
    numero: 2,
    titulo: "Evaluación Oncológica",
    icono: "🔬",
    contenido: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Qué esperar en tu primera consulta?</p>
          <p>Un médico oncólogo te revisará y revisará tus documentos. Te hará preguntas sobre tus síntomas, tu historial familiar y tu salud general. Es normal sentir nervios — puedes traer a alguien contigo.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Exámenes que pueden pedirte</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><span className="font-medium text-gray-700">Mamografía:</span> radiografía especial de los senos</li>
            <li><span className="font-medium text-gray-700">Ecografía:</span> imagen con ondas de sonido, no duele</li>
            <li><span className="font-medium text-gray-700">Colposcopía:</span> revisión del cuello uterino con una lupa especial</li>
            <li><span className="font-medium text-gray-700">Biopsia:</span> se toma una pequeña muestra de tejido para analizarla en el laboratorio</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Cómo prepararte?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Para la mamografía: no uses desodorante ni cremas ese día</li>
            <li>Para la biopsia: el médico te explicará los pasos antes de hacerlo</li>
            <li>Lleva una lista de tus dudas escritas para no olvidarlas</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    numero: 3,
    titulo: "Tratamiento",
    icono: "💊",
    contenido: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>El tratamiento depende del tipo y etapa del cáncer. Tu médico te explicará cuál es el más adecuado para ti. Aquí un resumen de cada uno:</p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="font-semibold text-blue-800 mb-1">🔪 Cirugía</p>
            <p>Se opera para retirar el tumor. Puede ser solo el tumor (tumorectomía) o todo el seno (mastectomía). La cirugía no siempre es el primer paso — depende de cada caso.</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
            <p className="font-semibold text-purple-800 mb-1">💉 Quimioterapia</p>
            <p>Medicamentos que destruyen las células cancerosas. Se aplica en ciclos (por ejemplo, cada 3 semanas). Puede causar cansancio, náuseas o caída del cabello — efectos que pasan con el tiempo.</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
            <p className="font-semibold text-orange-800 mb-1">☢️ Radioterapia</p>
            <p>Rayos de alta energía que atacan las células cancerosas en una zona específica. Las sesiones son cortas (minutos) y no duelen, aunque la piel puede irritarse.</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-100">
            <p className="font-semibold text-green-800 mb-1">💊 Hormonoterapia</p>
            <p>Pastillas o inyecciones que bloquean las hormonas que alimentan algunos tumores. Generalmente se toma por varios años después del tratamiento principal.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    numero: 4,
    titulo: "Seguimiento",
    icono: "📅",
    contenido: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Con qué frecuencia tienes controles?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Primeros 2 años: cada 3 a 6 meses</li>
            <li>Del año 3 al 5: una vez al año</li>
            <li>Después del año 5: según indicación médica</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Señales de alerta que debes reportar</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Bulto nuevo o cambio en el seno operado</li>
            <li>Dolor que no mejora o aparece sin causa</li>
            <li>Cansancio extremo o pérdida de peso sin razón</li>
            <li>Fiebre persistente o dificultad para respirar</li>
          </ul>
          <p className="mt-2 text-orange-700 font-medium">Si notas alguno de estos síntomas, no esperes tu próxima cita — llama al INEN.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Por qué es importante no faltar?</p>
          <p>Las citas de control permiten detectar a tiempo cualquier cambio. Faltar a controles puede retrasar el diagnóstico de una recaída cuando aún tiene solución.</p>
        </div>
      </div>
    ),
  },
  {
    numero: 5,
    titulo: "Alta o Remisión",
    icono: "🌟",
    contenido: (
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Qué significa estar en remisión?</p>
          <p>La remisión significa que los exámenes no muestran señales de cáncer en tu cuerpo. No siempre es una cura definitiva, pero es un paso muy importante. Tu médico te explicará si es remisión parcial o completa.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Cuidados después del tratamiento</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Mantén tus controles anuales aunque te sientas bien</li>
            <li>Cuida tu alimentación e intenta caminar o hacer ejercicio suave</li>
            <li>Evita el tabaco y el alcohol</li>
            <li>Habla con psicología si sientes ansiedad o miedo — es muy común y tiene solución</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-800 mb-1">¿Qué pasa si hay una recaída?</p>
          <p>Una recaída significa que el cáncer volvió. No significa que perdiste la batalla — muchas pacientes se tratan con éxito por segunda vez. Lo más importante es detectarlo pronto y acudir al INEN de inmediato.</p>
        </div>
      </div>
    ),
  },
];

function AcordeonItem({ item, isOpen, onToggle }: {
  item: Item;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn(
      "border rounded-xl overflow-hidden transition-all duration-200",
      isOpen ? "border-primary shadow-sm" : "border-gray-200"
    )}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors",
          isOpen ? "bg-primary-light" : "bg-white hover:bg-gray-50"
        )}
      >
        {/* Número / ícono */}
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold",
          isOpen ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
        )}>
          {item.numero}
        </div>

        {/* Título */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-semibold",
            isOpen ? "text-primary" : "text-gray-800"
          )}>
            <span className="mr-2">{item.icono}</span>
            {item.titulo}
          </p>
          {!isOpen && (
            <p className="text-xs text-gray-400 mt-0.5">Toca para ver más</p>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          size={18}
          className={cn(
            "flex-shrink-0 transition-transform duration-200 text-gray-400",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Contenido expandido */}
      {isOpen && (
        <div className="px-5 py-5 border-t border-gray-100 bg-white">
          {item.contenido}
        </div>
      )}
    </div>
  );
}

export default function InformacionAcordeon() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <div className="space-y-3">
      {PASOS.map((item, i) => (
        <AcordeonItem
          key={item.numero}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}
