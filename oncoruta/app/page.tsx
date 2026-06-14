import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

function dashboardForRole(role: UserRole): string {
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const serviceSupabase = createServiceClient();
  const { data: usuarioData } = await serviceSupabase
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  const role = (usuarioData?.rol ?? "paciente") as UserRole;
  redirect(dashboardForRole(role));
}
