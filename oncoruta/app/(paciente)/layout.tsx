import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function PacienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Nombre desde tabla usuarios; fallback a user_metadata (guardado en signUp)
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre")
    .eq("id", user.id)
    .single();

  const userName =
    usuario?.nombre ??
    (user.user_metadata?.nombre as string | undefined) ??
    user.email ??
    "";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="paciente" userName={userName} />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
