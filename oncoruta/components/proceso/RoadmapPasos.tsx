"use client";

import { useState, useEffect } from "react";
import { Check, Clock, ChevronDown } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

export type PasoRoadmap = {
  id: string;
  numero: number;
  nombre: string;
  descripcion: string;
  info_adicional: string;
  tiempo_estimado: string;
  estado: "completado" | "en_curso" | "pendiente";
};

interface Props {
  pasos: PasoRoadmap[];
}

export default function RoadmapPasos({ pasos }: Props) {
  const { t } = useIdioma();
  const [mounted, setMounted] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    pasos.forEach((p) => { if (p.estado === "en_curso") s.add(p.id); });
    return s;
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="relative">
      {/* Línea vertical punteada */}
      <div className="absolute left-5 top-5 bottom-5 border-l-2 border-dashed border-gray-200 dark:border-slate-600 z-0" />

      <div className="space-y-2">
        {pasos.map((paso, i) => {
          const isOpen   = openIds.has(paso.id);
          const isActive = paso.estado === "en_curso";
          const isDone   = paso.estado === "completado";
          const isPending = paso.estado === "pendiente";

          return (
            <div
              key={paso.id}
              className="transition-all duration-400"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.4s ease, transform 0.4s ease`,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <button
                type="button"
                onClick={() => toggle(paso.id)}
                className="w-full text-left flex items-start gap-4 group"
              >
                {/* Círculo */}
                <div className="relative flex-shrink-0 mt-0.5 z-10">
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25" />
                  )}
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      isDone
                        ? "bg-[#16a34a] text-white shadow-sm"
                        : isActive
                        ? "bg-[#1a56db] text-white shadow-md ring-4 ring-blue-100 dark:ring-blue-900"
                        : "bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-400"
                    }`}
                  >
                    {isDone ? <Check size={16} strokeWidth={3} /> : paso.numero}
                  </div>
                </div>

                {/* Contenido clickeable */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between gap-2 min-h-[40px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-semibold leading-snug ${
                          isDone ? "text-gray-500 dark:text-slate-400 line-through-none" : isActive ? "text-gray-900 dark:text-slate-100" : "text-gray-400 dark:text-slate-500"
                        }`}
                      >
                        {paso.nombre}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          isDone
                            ? "bg-green-100 text-green-700"
                            : isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                        }`}
                      >
                        {isDone ? t.completado : isActive ? t.enCurso : t.pendiente}
                      </span>
                    </div>
                    {/* Chevron para expandir */}
                    {!isDone && (paso.info_adicional || paso.descripcion) && (
                      <ChevronDown
                        size={16}
                        className={`flex-shrink-0 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* Siempre visible: descripcion breve */}
                  {!isDone && paso.descripcion && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {paso.descripcion}
                    </p>
                  )}

                  {/* Expandible: info adicional */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen && !isDone ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0"
                    }`}
                  >
                    {paso.info_adicional && (
                      <div className={`rounded-lg px-4 py-3 text-xs leading-relaxed ${
                        isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800" : "bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-600"
                      }`}>
                        {paso.info_adicional}
                      </div>
                    )}
                    {paso.tiempo_estimado && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 dark:text-slate-500">
                        <Clock size={12} />
                        <span>{paso.tiempo_estimado}</span>
                      </div>
                    )}
                  </div>

                  {/* Tiempo estimado (completados: siempre visible en mini) */}
                  {isDone && paso.tiempo_estimado && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{paso.tiempo_estimado}</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
