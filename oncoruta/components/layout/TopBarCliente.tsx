"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon } from "lucide-react";

interface Props {
  userName: string;
  userTelefono: string | null;
  userDni: string | null;
  initial: string;
}

export default function TopBarCliente({ userName, userTelefono, userDni, initial }: Props) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") ||
                   localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  function toggleDark() {
    const isDark = document.documentElement.classList.contains("dark");
    console.log("toggleDark called — isDark:", isDark, "classes:", document.documentElement.className);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
    console.log("after toggle — classes:", document.documentElement.className);
  }

  const subtitle = userTelefono ?? (userDni ? `DNI - ${userDni}` : null);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="relative p-2 rounded-lg text-muted hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
          <Bell size={18} />
        </button>

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
  );
}
