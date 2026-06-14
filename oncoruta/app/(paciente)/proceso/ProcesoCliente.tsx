"use client";

import { useIdioma } from "@/lib/i18n/IdiomaContext";
import translations, { Idioma } from "@/lib/i18n/translations";
import RoadmapPasos, { PasoRoadmap } from "@/components/proceso/RoadmapPasos";

type EstadoPaso = "completado" | "en_curso" | "pendiente";
type TipoPaciente = "preventivo" | "sospecha" | "diagnosticado";

export type PasoDisplay = {
  id: string;
  nombre: string;
  descripcion: string | null;
  estado: EstadoPaso;
  orden: number;
};

type Props = {
  pasos: PasoDisplay[];
  tipoPaciente: TipoPaciente;
};

type LangT = typeof translations[Idioma];

function getPasoExtras(
  t: LangT,
  tipoPaciente: TipoPaciente,
  orden: number
): { nombre: string; descripcion: string; info_adicional: string; tiempo_estimado: string } | null {
  if (tipoPaciente === "sospecha") {
    const mapa = [
      { nombre: t.paso0Nombre, descripcion: t.paso0Desc, info_adicional: t.paso0Info, tiempo_estimado: t.paso0Tiempo },
      { nombre: t.paso1Nombre, descripcion: t.paso1Desc, info_adicional: t.paso1Info, tiempo_estimado: t.paso1Tiempo },
      { nombre: t.paso2Nombre, descripcion: t.paso2Desc, info_adicional: t.paso2Info, tiempo_estimado: t.paso2Tiempo },
      { nombre: t.paso3Nombre, descripcion: t.paso3Desc, info_adicional: t.paso3Info, tiempo_estimado: t.paso3Tiempo },
      { nombre: t.paso4Nombre, descripcion: t.paso4Desc, info_adicional: t.paso4Info, tiempo_estimado: t.paso4Tiempo },
      { nombre: t.paso5Nombre, descripcion: t.paso5Desc, info_adicional: t.paso5Info, tiempo_estimado: t.paso5Tiempo },
    ];
    return mapa[orden] ?? null;
  }
  if (tipoPaciente === "preventivo") {
    const mapa = [
      { nombre: t.prevPaso1Nombre, descripcion: t.prevPaso1Desc, info_adicional: t.prevPaso1Info, tiempo_estimado: t.prevPaso1Tiempo },
      { nombre: t.prevPaso2Nombre, descripcion: t.prevPaso2Desc, info_adicional: t.prevPaso2Info, tiempo_estimado: t.prevPaso2Tiempo },
      { nombre: t.prevPaso3Nombre, descripcion: t.prevPaso3Desc, info_adicional: t.prevPaso3Info, tiempo_estimado: t.prevPaso3Tiempo },
    ];
    return mapa[orden] ?? null;
  }
  if (tipoPaciente === "diagnosticado") {
    const mapa = [
      { nombre: t.diagPaso1Nombre, descripcion: t.diagPaso1Desc, info_adicional: t.diagPaso1Info, tiempo_estimado: t.diagPaso1Tiempo },
      { nombre: t.diagPaso2Nombre, descripcion: t.diagPaso2Desc, info_adicional: t.diagPaso2Info, tiempo_estimado: t.diagPaso2Tiempo },
      { nombre: t.diagPaso3Nombre, descripcion: t.diagPaso3Desc, info_adicional: t.diagPaso3Info, tiempo_estimado: t.diagPaso3Tiempo },
      { nombre: t.diagPaso4Nombre, descripcion: t.diagPaso4Desc, info_adicional: t.diagPaso4Info, tiempo_estimado: t.diagPaso4Tiempo },
    ];
    return mapa[orden] ?? null;
  }
  return null;
}

const TIPO_BADGE_COLORS: Record<TipoPaciente, { bg: string; text: string }> = {
  preventivo:    { bg: "bg-green-100",  text: "text-green-700"  },
  sospecha:      { bg: "bg-yellow-100", text: "text-yellow-700" },
  diagnosticado: { bg: "bg-blue-100",   text: "text-blue-700"   },
};

export default function ProcesoCliente({ pasos, tipoPaciente }: Props) {
  const { idioma, t } = useIdioma();
  const langT = translations[idioma];

  const tipoBadgeLabel: Record<TipoPaciente, string> = idioma === "es"
    ? { preventivo: "Chequeo preventivo", sospecha: "Con sospecha", diagnosticado: "Diagnóstico confirmado" }
    : { preventivo: "Qhawariy",           sospecha: "Sospecha nisqa", diagnosticado: "Diagnosticasqa" };

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

  const badgeColors = TIPO_BADGE_COLORS[tipoPaciente];

  const roadmapPasos: PasoRoadmap[] = pasos.map((paso, i) => {
    const extras = getPasoExtras(langT, tipoPaciente, paso.orden);
    return {
      id: paso.id,
      numero: i + 1,
      nombre: extras?.nombre ?? paso.nombre,
      descripcion: extras?.descripcion ?? paso.descripcion ?? "",
      info_adicional: extras?.info_adicional ?? "",
      tiempo_estimado: extras?.tiempo_estimado ?? "",
      estado: paso.estado,
    };
  });

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">{t.tituloRoadmap}</h1>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors.bg} ${badgeColors.text}`}>
            {tipoBadgeLabel[tipoPaciente]}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {tipoSubtitle[tipoPaciente]}
        </p>
      </div>

      <div className="p-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
          <RoadmapPasos pasos={roadmapPasos} />
        </div>
      </div>
    </>
  );
}
