"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  GitBranch,
  FileText,
  Calendar,
  Info,
  LogOut,
  Heart,
  Users,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/supabase/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navByRole: Record<UserRole, NavItem[]> = {
  paciente: [
    { href: "/dashboard", label: "Inicio", icon: <Home size={18} />, exact: true },
    { href: "/proceso", label: "Mi Proceso", icon: <GitBranch size={18} /> },
    { href: "/documentos", label: "Documentos", icon: <FileText size={18} /> },
    { href: "/citas", label: "Mis Citas", icon: <Calendar size={18} /> },
    { href: "/informacion", label: "Información", icon: <Info size={18} /> },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Panel", icon: <LayoutDashboard size={18} />, exact: true },
    { href: "/admin/pacientes", label: "Pacientes", icon: <Users size={18} /> },
    { href: "/admin/doctores", label: "Doctores", icon: <Stethoscope size={18} /> },
  ],
};

interface SidebarProps {
  role?: UserRole;
  userName?: string;
}

export default function Sidebar({ role = "paciente", userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const nav = navByRole[role];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-primary">Portal INEN</span>
            <p className="text-xs text-muted -mt-0.5">Atención al Paciente</p>
          </div>
        </div>
      </div>

      {/* User info */}
      {userName && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted capitalize">{role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
              isActive(item)
                ? "bg-primary-light text-primary"
                : "text-muted hover:bg-gray-50 hover:text-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-red-50 hover:text-danger transition-colors duration-150 w-full"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
