import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import { IdiomaProvider } from "@/lib/i18n/IdiomaContext";

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
    <IdiomaProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar role="admin" userName={userName} />
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </IdiomaProvider>
  );
}
