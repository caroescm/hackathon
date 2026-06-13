import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

function dashboardForRole(role: UserRole): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "familiar") return "/familiar/dashboard";
  return "/dashboard";
}

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = (user.user_metadata?.role ?? "paciente") as UserRole;
  redirect(dashboardForRole(role));
}
