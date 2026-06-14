"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SolicitarCita from "@/components/citas/SolicitarCita";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

type Cita = {
  id: string;
  servicio: string;
  fecha: string;
  hora: string | null;
  piso: string | null;
  estado: string;
};

const estadoVariant: Record<string, "success" | "warning" | "info" | "default"> = {
  confirmada:  "success",
  programada:  "warning",
  solicitada:  "info",
  completada:  "default",
};

function formatFecha(fecha: string) {
  try {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return fecha;
  }
}

export default function CitasCliente({ proximas, pasadas }: { proximas: Cita[]; pasadas: Cita[] }) {
  const { t, idioma } = useIdioma();

  function estadoLabel(estado: string) {
    if (estado === "solicitada") return idioma === "es" ? "Pendiente de confirmación" : "Suyasqa";
    if (estado === "confirmada") return idioma === "es" ? "Confirmada" : "Allinmi";
    if (estado === "programada") return idioma === "es" ? "Programada" : "Churasqa";
    if (estado === "completada") return t.completado;
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900">{t.misCitasTitulo}</h1>
        <p className="text-sm text-gray-500">{t.misCitasSubtitle}</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Módulo de acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Solicitud de citas */}
          <div className="bg-white rounded-xl border border-gray-200 p-7 flex flex-col gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FCE4EC" }}>
              <Calendar size={22} style={{ color: "#C2185B" }} />
            </div>
            <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 leading-snug">
              {idioma === "es" ? "SOLICITUD DE CITAS" : "TUPANAKUY MAÑAY"}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              {idioma === "es"
                ? "Solicita tu cita según la disponibilidad del servicio o departamento correspondiente."
                : "Tupanakuykita mañay hampiq wasimanta."}
            </p>
            <div>
              <SolicitarCita
                triggerLabel={idioma === "es" ? "Ingresar" : "Yaykuy"}
                triggerClassName="bg-[#C2185B] hover:bg-[#a01549] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors"
              />
            </div>
          </div>

          {/* Consulta tu cita */}
          <div className="bg-white rounded-xl border border-gray-200 p-7 flex flex-col gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EDE7F6" }}>
              <Search size={22} style={{ color: "#5E35B1" }} />
            </div>
            <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 leading-snug">
              {idioma === "es" ? "CONSULTA TU CITA" : "TUPANAKUYNIYKITA MASK'AY"}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              {idioma === "es"
                ? "¿Quieres saber cuándo es tu próxima cita? Haz clic aquí y revisa los detalles al instante."
                : "Qatiq tupanakuyniykita yachanki munajtinki? Kaypim tarinki."}
            </p>
            <div>
              <a href="#mis-citas">
                <button className="bg-[#5E35B1] hover:bg-[#4a2990] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors">
                  {idioma === "es" ? "Ingresar" : "Yaykuy"}
                </button>
              </a>
            </div>
          </div>
        </div>

        <div id="mis-citas" />
        <Card
          title={t.proximasCitasTitulo}
          description={proximas.length > 0
            ? idioma === "es"
              ? `${proximas.length} cita${proximas.length !== 1 ? "s" : ""} programada${proximas.length !== 1 ? "s" : ""}`
              : `${proximas.length} tupanakuy`
            : undefined}
        >
          {proximas.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">{t.sinProxCitas}</p>
          ) : (
            <div className="space-y-3">
              {proximas.map((cita) => (
                <div key={cita.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">{cita.servicio}</h3>
                    <Badge variant={(estadoVariant[cita.estado] ?? "default") as "success" | "warning" | "info" | "default"}>
                      {estadoLabel(cita.estado)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {cita.fecha ? formatFecha(cita.fecha) : (idioma === "es" ? "Por confirmar" : "Manaranmi")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {cita.hora ?? (idioma === "es" ? "Por confirmar" : "Manaranmi")}
                    </div>
                    {cita.piso && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin size={12} />
                        {cita.piso}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {pasadas.length > 0 && (
          <Card title={t.citasAnteriores}>
            <div className="space-y-3">
              {pasadas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted">{cita.servicio}</p>
                    <p className="text-xs text-muted">{formatFecha(cita.fecha)}{cita.hora ? ` · ${cita.hora}` : ""}</p>
                  </div>
                  <Badge variant={estadoVariant[cita.estado] ?? "default"}>
                    {estadoLabel(cita.estado)}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
