"use client";

import Card from "@/components/ui/Card";
import { Phone, TriangleAlert } from "lucide-react";
import InformacionAcordeon from "./InformacionAcordeon";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

const CONTACTOS = [
  { label: "Central telefónica",    valor: "(01) 201-6000", ext: null   },
  { label: "Trabajo Social",        valor: "(01) 201-6000", ext: "2050" },
  { label: "Psicología Oncológica", valor: "(01) 201-6000", ext: "2070" },
];

export default function InformacionPage() {
  const { idioma, t } = useIdioma();

  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900">{t.infoTitulo}</h1>
        <p className="text-sm text-gray-500">{t.infoSubtitle}</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Beta notice in Quechua */}
        {idioma === "qu" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center gap-2.5">
            <span className="text-xs font-bold text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded">Beta</span>
            <p className="text-xs text-amber-800 leading-snug">
              Contenidoqa español simipin — traducción quechua chanka allichakuchkaptinraqmi.
            </p>
          </div>
        )}

        {/* Emergency card — always visible */}
        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TriangleAlert size={16} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800 mb-1">Emergencias</p>
              <p className="text-sm text-red-700 leading-relaxed">
                Ve a emergencias del INEN si tienes <span className="font-semibold">fiebre mayor a 38 °C</span>, sangrado que no para, o sangre en la orina.
              </p>
              <p className="text-sm font-semibold text-red-800 mt-1.5">Central: (01) 201-6000</p>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <InformacionAcordeon />

        {/* Contacts */}
        <Card title="Contactos INEN" description="Lunes a viernes, 8:00 AM – 5:00 PM">
          <ul className="space-y-3">
            {CONTACTOS.map((c) => (
              <li key={c.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{c.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 tabular-nums">
                  {c.valor}
                  {c.ext && <span className="text-gray-400 font-normal"> ext. {c.ext}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
