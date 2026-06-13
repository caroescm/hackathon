"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import FilterBar, { type FiltroEtapa, type FiltroPrioridad } from "./FilterBar";
import { getPrioridad, type Prioridad } from "@/lib/utils/prioridad";

type PerfilVulnerabilidad = {
  jefa_hogar: boolean | null;
  de_provincia: boolean | null;
  tiene_discapacidad: boolean | null;
  habla_quechua: boolean | null;
} | null;

type ProcesoPaciente = {
  estado: string;
  pasos: { nombre: string; orden: number } | null;
};

export type PacienteRow = {
  id: string;
  nombre: string;
  dni: string | null;
  perfil_vulnerabilidad: PerfilVulnerabilidad;
  proceso_paciente: ProcesoPaciente[];
  inactivo: boolean;
};

const PRIORIDAD_BADGE: Record<Exclude<Prioridad, "BAJA">, { variant: "danger" | "warning"; label: string }> = {
  ALTA:  { variant: "danger",  label: "Alta prioridad" },
  MEDIA: { variant: "warning", label: "Media prioridad" },
};

function etapaActual(procesos: ProcesoPaciente[]): string | null {
  return procesos.find((p) => p.estado === "en_curso")?.pasos?.nombre ?? null;
}

export default function TablaPacientes({ pacientes }: { pacientes: PacienteRow[] }) {
  const [filtroPrioridad, setFiltroPrioridad] = useState<FiltroPrioridad>("Todas");
  const [filtroEtapa, setFiltroEtapa] = useState<FiltroEtapa>("Todas");

  const filtrados = pacientes.filter((p) => {
    const prioridad = getPrioridad(p.perfil_vulnerabilidad);
    if (filtroPrioridad !== "Todas" && prioridad !== filtroPrioridad) return false;

    const etapa = etapaActual(p.proceso_paciente);
    if (filtroEtapa !== "Todas" && etapa !== filtroEtapa) return false;

    return true;
  });

  return (
    <div className="space-y-4">
      <FilterBar
        filtroPrioridad={filtroPrioridad}
        filtroEtapa={filtroEtapa}
        onPrioridad={setFiltroPrioridad}
        onEtapa={setFiltroEtapa}
      />

      {filtrados.length === 0 ? (
        <p className="text-sm text-muted text-center py-4">
          No hay pacientes que coincidan con los filtros seleccionados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Paciente</th>
                <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">DNI</th>
                <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Etapa actual</th>
                <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Prioridad</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((p) => {
                const etapa = etapaActual(p.proceso_paciente);
                const prioridad = getPrioridad(p.perfil_vulnerabilidad);
                const badgePrioridad = prioridad !== "BAJA" ? PRIORIDAD_BADGE[prioridad] : null;

                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{p.nombre}</span>
                        {p.inactivo && (
                          <Badge variant="danger">Sin actividad</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-muted font-mono text-xs">{p.dni ?? "—"}</td>
                    <td className="py-3">
                      {etapa ? (
                        <Badge variant="info">{etapa}</Badge>
                      ) : (
                        <span className="text-xs text-muted">Sin etapa</span>
                      )}
                    </td>
                    <td className="py-3">
                      {badgePrioridad && (
                        <Badge variant={badgePrioridad.variant}>{badgePrioridad.label}</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/paciente/${p.id}`}
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Ver expediente
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
