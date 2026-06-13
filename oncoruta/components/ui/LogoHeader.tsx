import Image from "next/image";

interface LogoHeaderProps {
  className?: string;
  size?: "sm" | "md";
}

export default function LogoHeader({ className = "", size = "md" }: LogoHeaderProps) {
  const escudoH = size === "sm" ? 48 : 60;
  const escudoW = size === "sm" ? 38 : 48;
  const minsaH = size === "sm" ? 34 : 44;
  const minsaW = size === "sm" ? 110 : 140;
  const inenH = size === "sm" ? 34 : 44;
  const inenW = size === "sm" ? 90 : 115;

  return (
    <div className={`flex items-center justify-center gap-5 ${className}`}>
      <Image
        src="/logos/escudo-peru.svg"
        alt="Escudo del Perú"
        width={escudoW}
        height={escudoH}
        priority
      />
      <div className="h-10 w-px bg-gray-300" />
      <Image
        src="/logos/minsa.svg"
        alt="Ministerio de Salud del Perú"
        width={minsaW}
        height={minsaH}
        priority
      />
      <div className="h-10 w-px bg-gray-300" />
      <Image
        src="/logos/inen.svg"
        alt="INEN - Instituto Nacional de Enfermedades Neoplásicas"
        width={inenW}
        height={inenH}
        priority
      />
    </div>
  );
}
