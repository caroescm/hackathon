"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Sun, Moon, CheckCheck } from "lucide-react";

interface Props {
  userName: string;
  userTelefono: string | null;
  userDni: string | null;
  initial: string;
}

const NOTIFS = [
  {
    id: 1,
    color: "bg-green-500",
    title: "Documento aprobado",
    desc: "Tu hoja de referencia fue aprobada. Ya puedes agendar tu siguiente cita.",
    time: "hace 2 horas",
  },
  {
    id: 2,
    color: "bg-[#3B52A2]",
    title: "Cita confirmada",
    desc: "Tu cita de consulta con especialista es el 18 de junio a las 10:30 — Piso 3.",
    time: "hace 1 día",
  },
  {
    id: 3,
    color: "bg-yellow-500",
    title: "Acción pendiente",
    desc: "Sube tus resultados de análisis de sangre para avanzar al paso 4.",
    time: "hace 2 días",
  },
];


export default function TopBarCliente({ userName, userTelefono, userDni, initial }: Props) {
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [leidas, setLeidas] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    setDark(false);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  function handleBellClick() {
    setNotifOpen((v) => !v);
  }

  function toggleDark() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  function marcarLeidas() {
    setLeidas(true);
    setNotifOpen(false);
  }

  const telefono = userTelefono ?? "+51 9** *** ***";
  const subtitle = userTelefono ?? (userDni ? `DNI - ${userDni}` : null);

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
        <div />
        <div className="flex items-center gap-3">

          {/* Notificaciones */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleBellClick}
              className="relative p-2 rounded-lg text-muted hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notificaciones"
            >
              <Bell size={18} />
              {!leidas && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  3
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">Notificaciones</span>
                </div>

                {/* Lista */}
                <div className="divide-y divide-gray-50 dark:divide-slate-700">
                  {NOTIFS.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3.5 transition-colors ${
                        leidas ? "opacity-50" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${n.color} flex-shrink-0 mt-1.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
                          {n.time} · Enviado por WhatsApp al {telefono}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                  <button
                    onClick={marcarLeidas}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <CheckCheck size={15} />
                    Marcar todas como leídas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Modo oscuro"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Nombre + dato secundario + avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{userName}</p>
              {subtitle && (
                <p className="text-xs text-muted dark:text-slate-400">{subtitle}</p>
              )}
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#3B52A2] text-white flex items-center justify-center font-semibold text-sm select-none">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
          </div>

        </div>
      </header>

    </>
  );
}
