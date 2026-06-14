import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBarCliente from "@/components/layout/TopBarCliente";
import ChatBot from "@/components/chat/ChatBot";
import { IdiomaProvider } from "@/lib/i18n/IdiomaContext";

export default async function PacienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre, dni, telefono")
    .eq("id", user.id)
    .single();

  const userName =
    (usuario?.nombre as string | undefined)?.trim() ||
    (user.user_metadata?.nombre as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Paciente";

  const userDni      = usuario?.dni      as string | null;
  const userTelefono = usuario?.telefono as string | null;
  const initial      = userName.charAt(0).toUpperCase();

  return (
    <IdiomaProvider>
      <div className="flex h-screen overflow-hidden bg-[#eef0f8] dark:bg-gray-950">
        <Sidebar role="paciente" userName={userName} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBarCliente
            userName={userName}
            userTelefono={userTelefono}
            userDni={userDni}
            initial={initial}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <ChatBot />
      </div>
    </IdiomaProvider>
  );
}
