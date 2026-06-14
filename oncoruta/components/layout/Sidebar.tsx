"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  Search,
  LogOut,
  LayoutDashboard,
  Users,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/lib/supabase/types";

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
  const [consultasOpen, setConsultasOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  /* ─── ADMIN ─────────────────────────────────────────── */
  if (role === "admin") {
    return (
      <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-border min-h-[64px] flex items-center">
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
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    );
  }

  /* ─── PACIENTE ───────────────────────────────────────── */
  return (
    <aside
      className={cn(
        "min-h-screen bg-white border-r border-border flex flex-col transition-all duration-200 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + collapse button */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between min-h-[64px]">
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
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            collapsed && "justify-center"
          )}
        >
          <Home size={18} className="flex-shrink-0" />
          {!collapsed && "Inicio"}
        </Link>

        {/* Consultas group */}
        {collapsed ? (
          <Link
            href="/citas"
            className={cn(
              "flex items-center justify-center px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive("/citas") || isActive("/documentos")
                ? "bg-[#1a2f5a] text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Search size={18} />
          </Link>
        ) : (
          <div>
            <button
              onClick={() => setConsultasOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search size={18} />
                Consultas
              </div>
              {consultasOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {consultasOpen && (
              <div className="mt-0.5 ml-3 border-l-2 border-gray-200 pl-3 space-y-0.5">
                <Link
                  href="/citas"
                  className={cn(
                    "flex items-center gap-2.5 py-1.5 px-2 text-sm rounded-md transition-colors",
                    pathname === "/citas"
                      ? "text-[#3B52A2] font-medium"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  Solicitud Citas
                </Link>
                <Link
                  href="/citas"
                  className={cn(
                    "flex items-center gap-2.5 py-1.5 px-2 text-sm rounded-md transition-colors",
                    pathname === "/citas"
                      ? "text-[#3B52A2] font-medium"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  Consulta tu cita
                </Link>
                <Link
                  href="/documentos"
                  className={cn(
                    "flex items-center gap-2.5 py-1.5 px-2 text-sm rounded-md transition-colors",
                    pathname === "/documentos"
                      ? "text-[#3B52A2] font-medium"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  Documentos Digitales
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Configuración group */}
        {collapsed ? (
          <button className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors w-full">
            <Settings size={18} />
          </button>
        ) : (
          <div>
            <button
              onClick={() => setConfigOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                Configuración
              </div>
              {configOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {configOpen && (
              <div className="mt-0.5 ml-3 border-l-2 border-gray-200 pl-3 space-y-0.5">
                <span className="flex items-center gap-2.5 py-1.5 px-2 text-sm text-gray-400 cursor-not-allowed select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  Mis Datos
                </span>
                <span className="flex items-center gap-2.5 py-1.5 px-2 text-sm text-gray-400 cursor-not-allowed select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  Contraseña
                </span>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
