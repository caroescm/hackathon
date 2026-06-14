import Card from "@/components/ui/Card";
import { Phone } from "lucide-react";
import InformacionAcordeon from "./InformacionAcordeon";

const CONTACTOS = [
  { label: "Central telefónica", valor: "(01) 201-6000", ext: null },
  { label: "Trabajo Social", valor: "(01) 201-6000", ext: "2050" },
  { label: "Psicología Oncológica", valor: "(01) 201-6000", ext: "2070" },
];

export default function InformacionPage() {
  return (
    <>
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Información</h1>
        <p className="text-sm text-gray-500">Guía paso a paso de tu proceso en el INEN</p>
      </div>
      <div className="p-6 space-y-6">
        <InformacionAcordeon />

        <Card title="Contactos INEN" description="Lunes a viernes, 8:00 AM – 5:00 PM">
          <ul className="space-y-3">
            {CONTACTOS.map((c) => (
              <li key={c.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Phone size={13} className="text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">{c.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 tabular-nums">
                  {c.valor}{c.ext && <span className="text-gray-400 font-normal"> ext. {c.ext}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
