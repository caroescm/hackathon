"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import translations, { Idioma } from "./translations";

type IdiomaContextType = {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: typeof translations[Idioma];
};

const IdiomaContext = createContext<IdiomaContextType | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>("es");
  const t = translations[idioma];
  return (
    <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma must be used inside IdiomaProvider");
  return ctx;
}
