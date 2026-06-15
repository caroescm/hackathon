import { createServiceClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AgregarDoctor from "@/components/admin/AgregarDoctor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Doctor = {
  id: string;
  nombre: string;
  especialidad: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean | null;
};

export default async function DoctoresPage() {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("doctores")
    .select("id, nombre, especialidad, telefono, email, activo")
    .order("nombre", { ascending: true });

  const doctores = (data as Doctor[] | null) ?? [];

  return (
    <>
      <TopBar title="Doctores" subtitle={`${doctores.length} doctor${doctores.length !== 1 ? "es" : ""} registrado${doctores.length !== 1 ? "s" : ""}`} />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
          <AgregarDoctor />
        </div>

        <Card>
          {doctores.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No hay doctores registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Nombre</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Especialidad</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Teléfono</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                    <th className="text-left py-2 text-xs font-medium text-muted uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {doctores.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-foreground">{d.nombre}</td>
                      <td className="py-3 text-muted">{d.especialidad ?? "—"}</td>
                      <td className="py-3 text-muted tabular-nums">{d.telefono ?? "—"}</td>
                      <td className="py-3 text-muted">{d.email ?? "—"}</td>
                      <td className="py-3">
                        <Badge variant={d.activo ? "success" : "default"}>
                          {d.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
