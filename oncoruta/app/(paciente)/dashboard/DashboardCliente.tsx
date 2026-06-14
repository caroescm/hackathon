"use client";

import Link from "next/link";
import { Calendar, FileText, GitBranch, MessageCircle, Lock, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

type PasoInfo = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
};

type ProcesoRow = {
  id: string;
  estado: string;
  pasos: PasoInfo | null;
};

type Props = {
  proximaCita: { servicio: string; fecha: string } | null;
  citaFechaFormateada: string | null;
  totalDocumentos: number;
  proceso: ProcesoRow[];
  etapaActualNombre: string | null;
};


export default function DashboardCliente({
  proximaCita,
  citaFechaFormateada,
  totalDocumentos,
  proceso,
  etapaActualNombre,
}: Props) {
  const { t, idioma } = useIdioma();

  const TOP_CARDS = [
    {
      icon: Lock,
      iconBg: "#E8EAF0",
      iconColor: "#3B52A2",
      title: idioma === "es" ? "CONSULTA TUS RESULTADOS" : "QILLQAYKIKUNATA MASK'AY",
      description: idioma === "es"
        ? "Tendrás acceso a la visualización y descarga de sus documentos digitales."
        : "Qillqaykikunata qhawanki, uqhaykitaqmi atinki.",
      href: "/documentos",
      btnClassName: "bg-[#1a2f5a] hover:bg-[#152248] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors",
    },
    {
      icon: Search,
      iconBg: "#EDE7F6",
      iconColor: "#5E35B1",
      title: idioma === "es" ? "CONSULTA TU CITA" : "TUPANAKUYNIYKITA MASK'AY",
      description: idioma === "es"
        ? "¿Quieres saber cuándo es tu próxima cita? Haz clic aquí y revisa los detalles al instante."
        : "Qatiq tupanakuyniykita yachanki munajtinki? Kaypim tarinki.",
      href: "/citas",
      btnClassName: "bg-[#5E35B1] hover:bg-[#4a2990] text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-colors",
    },
  ];

  const stats = [
    {
      label: t.proximaCita,
      value: citaFechaFormateada ?? "—",
      sub: citaFechaFormateada ? (proximaCita?.servicio ?? "") : t.sinCitas,
      icon: <Calendar size={20} className="text-[#3B52A2]" />,
      iconBg: "bg-[#E8EAF0]",
    },
    {
      label: t.documentos,
      value: totalDocumentos.toString(),
      sub: t.archivosSubidos,
      icon: <FileText size={20} className="text-success" />,
      iconBg: "bg-green-50",
    },
    {
      label: t.etapaActual,
      value: etapaActualNombre ?? "—",
      sub: t.enCurso,
      icon: <GitBranch size={20} className="text-warning" />,
      iconBg: "bg-yellow-50",
    },
    {
      label: idioma === "es" ? "Mensajes" : "Willakuykuna",
      value: "0",
      sub: idioma === "es" ? "sin leer" : "mana leesqachu",
      icon: <MessageCircle size={20} className="text-purple-600" />,
      iconBg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ── Fila superior: Resultados + Consulta cita ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TOP_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-7 flex flex-col gap-4 shadow-sm"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                <Icon size={22} style={{ color: card.iconColor }} />
              </div>
              <h2 className="text-[14px] font-black uppercase tracking-wide text-gray-900 dark:text-slate-100 leading-snug">
                {card.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-1">{card.description}</p>
              <div>
                <Link href={card.href}>
                  <button className={card.btnClassName}>{idioma === "es" ? "Ingresar" : "Yaykuy"}</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-0">
            <div className="p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted font-medium">{stat.label}</p>
                <p className="text-base font-bold text-foreground leading-tight truncate">{stat.value}</p>
                <p className="text-xs text-muted">{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Proceso + Citas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title={t.miProcesoTratamiento}>
            {proceso.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">{t.noEtapas}</p>
            ) : (
              <div className="space-y-3">
                {proceso.map((item) => {
                  const paso = item.pasos;
                  const estado = item.estado;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          estado === "completado" ? "bg-success"
                          : estado === "en_curso" ? "bg-[#3B52A2]"
                          : "bg-gray-200"
                        }`}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className={`text-sm font-medium ${estado === "pendiente" ? "text-muted" : "text-foreground"}`}>
                          {paso?.nombre ?? "—"}
                        </span>
                        <Badge variant={estado === "completado" ? "success" : estado === "en_curso" ? "info" : "default"}>
                          {estado === "completado" ? t.completado : estado === "en_curso" ? t.enCurso : t.pendiente}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card title={t.proximasCitas}>
          {proximaCita ? (
            <div className="border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{proximaCita.servicio}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar size={12} />
                {citaFechaFormateada}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-4">{t.noHayCitas}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
