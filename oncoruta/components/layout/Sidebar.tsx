"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Stethoscope,
  GitBranch,
  Info,
  Calendar,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/lib/supabase/types";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

interface SidebarProps {
  role?: UserRole;
  userName?: string;
}

const adminNav = [
  { href: "/admin/dashboard", label: "Panel", icon: <LayoutDashboard size={18} />, exact: true },
  { href: "/admin/pacientes", label: "Pacientes", icon: <Users size={18} /> },
  { href: "/admin/doctores", label: "Doctores", icon: <Stethoscope size={18} /> },
];

export default function Sidebar({ role = "paciente" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const { idioma, setIdioma, t } = useIdioma();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  /* ─── ADMIN ─────────────────────────────────────────── */
  if (role === "admin") {
    return (
      <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-border dark:border-slate-700 flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-border dark:border-slate-700 min-h-[64px] flex items-center">
          <Image
            src="/logos/minsa_inen.png"
            alt="MINSA - INEN"
            width={160}
            height={32}
            className="object-contain"
            priority
          />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {adminNav.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-[#1a2f5a] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={18} />
            {t.cerrarSesion}
          </button>
        </div>
      </aside>
    );
  }

  /* ─── PACIENTE ───────────────────────────────────────── */
  return (
    <aside
      className={cn(
        "h-full bg-white dark:bg-slate-900 border-r border-border dark:border-slate-700 flex flex-col transition-all duration-200 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + collapse button */}
      <div className="px-4 py-4 border-b border-border dark:border-slate-700 flex items-center justify-between min-h-[64px]">
        {!collapsed && (
          <Image
            src="/logos/minsa_inen.png"
            alt="MINSA - INEN"
            width={148}
            height={30}
            className="object-contain"
            priority
          />
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-7 h-7 rounded-full bg-[#3B52A2] text-white flex items-center justify-center flex-shrink-0 ml-auto"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {/* Inicio */}
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/dashboard", true)
              ? "bg-[#1a2f5a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            collapsed && "justify-center"
          )}
        >
          <Home size={18} className="flex-shrink-0" />
          {!collapsed && t.inicio}
        </Link>

        {/* Mis Citas */}
        <Link
          href="/citas"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/citas")
              ? "bg-[#1a2f5a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            collapsed && "justify-center"
          )}
        >
          <Calendar size={18} className="flex-shrink-0" />
          {!collapsed && t.misCitas}
        </Link>

        {/* Mis Documentos */}
        <Link
          href="/documentos"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/documentos")
              ? "bg-[#1a2f5a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            collapsed && "justify-center"
          )}
        >
          <FileText size={18} className="flex-shrink-0" />
          {!collapsed && t.misDocumentos}
        </Link>

        {/* Mi Proceso */}
        <Link
          href="/proceso"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/proceso")
              ? "bg-[#1a2f5a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            collapsed && "justify-center"
          )}
        >
          <GitBranch size={18} className="flex-shrink-0" />
          {!collapsed && t.misProceso}
        </Link>

        {/* Información */}
        <Link
          href="/informacion"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/informacion")
              ? "bg-[#1a2f5a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            collapsed && "justify-center"
          )}
        >
          <Info size={18} className="flex-shrink-0" />
          {!collapsed && t.informacion}
        </Link>

        {/* Configuración group */}
        {collapsed ? (
          <button className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors w-full">
            <Settings size={18} />
          </button>
        ) : (
          <div>
            <button
              onClick={() => setConfigOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                {t.configuracion}
              </div>
              {configOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {configOpen && (
              <div className="mt-0.5 ml-3 border-l-2 border-gray-200 dark:border-slate-600 pl-3 space-y-0.5">
                <span className="flex items-center gap-2.5 py-1.5 px-2 text-sm text-gray-400 dark:text-slate-500 cursor-not-allowed select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  Mis Datos
                </span>
                <span className="flex items-center gap-2.5 py-1.5 px-2 text-sm text-gray-400 dark:text-slate-500 cursor-not-allowed select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  Contraseña
                </span>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout + Language toggle */}
      <div className="px-3 py-4 border-t border-border dark:border-slate-700 space-y-1">
        {!collapsed && (
          <div className="px-2 pb-1">
            <button
              onClick={() => setIdioma(idioma === "es" ? "qu" : "es")}
              className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <span className="font-medium">{idioma === "es" ? "ES" : "QU"}</span>
              <span className="text-gray-300">|</span>
              <span>{idioma === "es" ? "Quechua" : "Español"}</span>
            </button>
            {idioma === "qu" && (
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 px-2 leading-snug">
                {t.disclaimerQuechua}
              </p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && t.cerrarSesion}
        </button>
      </div>
    </aside>
  );
}
