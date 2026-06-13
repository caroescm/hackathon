import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre")
    .eq("id", user.id)
    .single();

  const userName = usuario?.nombre ?? user.email ?? "";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="admin" userName={userName} />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
