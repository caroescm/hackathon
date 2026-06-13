"use client";

import { cn } from "@/lib/utils/cn";
import type { Prioridad } from "@/lib/utils/prioridad";

export const ETAPAS = [
  "Admisión y Registro",
  "Evaluación Oncológica",
  "Tratamiento",
  "Seguimiento",
  "Alta o Remisión",
] as const;

export type FiltroEtapa = (typeof ETAPAS)[number] | "Todas";
export type FiltroPrioridad = Prioridad | "Todas";

interface Props {
  filtroPrioridad: FiltroPrioridad;
  filtroEtapa: FiltroEtapa;
  onPrioridad: (v: FiltroPrioridad) => void;
  onEtapa: (v: FiltroEtapa) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      {children}
    </button>
  );
}

const PRIORIDADES: FiltroPrioridad[] = ["Todas", "ALTA", "MEDIA", "BAJA"];

export default function FilterBar({ filtroPrioridad, filtroEtapa, onPrioridad, onEtapa }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted w-16 flex-shrink-0">Prioridad</span>
        {PRIORIDADES.map((p) => (
          <Chip key={p} active={filtroPrioridad === p} onClick={() => onPrioridad(p)}>
            {p === "Todas" ? "Todas" : p.charAt(0) + p.slice(1).toLowerCase()}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-muted w-16 flex-shrink-0">Etapa</span>
        <Chip active={filtroEtapa === "Todas"} onClick={() => onEtapa("Todas")}>
          Todas
        </Chip>
        {ETAPAS.map((e) => (
          <Chip key={e} active={filtroEtapa === e} onClick={() => onEtapa(e)}>
            {e}
          </Chip>
        ))}
      </div>
    </div>
  );
}
