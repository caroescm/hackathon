import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import { BookOpen, Phone, Heart, AlertCircle } from "lucide-react";

const secciones = [
  {
    icono: <BookOpen size={20} className="text-primary" />,
    titulo: "¿Qué es el cáncer de mama?",
    contenido:
      "El cáncer de mama ocurre cuando las células del seno crecen de manera descontrolada. Puede formarse en diferentes partes del seno. La detección temprana aumenta significativamente las posibilidades de tratamiento exitoso.",
  },
  {
    icono: <Heart size={20} className="text-danger" />,
    titulo: "Cuidado personal durante el tratamiento",
    contenido:
      "Mantén una alimentación equilibrada, duerme suficiente y realiza actividad física suave según las indicaciones de tu médico. No dudes en pedir apoyo emocional a tu familia o a un profesional.",
  },
  {
    icono: <AlertCircle size={20} className="text-warning" />,
    titulo: "Efectos secundarios comunes",
    contenido:
      "La quimioterapia puede causar fatiga, náuseas, caída de cabello y mayor sensibilidad a infecciones. Tu equipo médico puede ayudarte a manejar estos efectos con medicamentos y recomendaciones.",
  },
  {
    icono: <Phone size={20} className="text-success" />,
    titulo: "Líneas de apoyo INEN",
    contenido:
      "Centro de Información: (01) 201-6000. Servicio Social: ext. 2050. Psicología Oncológica: ext. 2070. Lunes a viernes de 8:00 AM a 5:00 PM.",
  },
];

export default function InformacionPage() {
  return (
    <>
      <TopBar title="Información" subtitle="Recursos y guías para tu proceso" />
      <div className="p-6 space-y-4">
        {secciones.map((seccion, i) => (
          <Card key={i}>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {seccion.icono}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{seccion.titulo}</h3>
                <p className="text-sm text-muted leading-relaxed">{seccion.contenido}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
