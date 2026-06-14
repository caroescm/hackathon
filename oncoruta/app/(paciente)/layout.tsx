import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import ChatBot from "@/components/chat/ChatBot";
import { Bell } from "lucide-react";

export default async function PacienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre, dni")
    .eq("id", user.id)
    .single();

  const userName =
    (usuario?.nombre as string | undefined) ??
    (user.user_metadata?.nombre as string | undefined) ??
    user.email ??
    "Paciente";

  const userDni = usuario?.dni as string | null;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#eef0f8]">
      <Sidebar role="paciente" userName={userName} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg text-muted hover:bg-gray-50 transition-colors">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-muted">
                  {userDni ? `DNI - ${userDni}` : user.email}
                </p>
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#3B52A2] text-white flex items-center justify-center font-semibold text-sm select-none">
                  {initial}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <ChatBot />
    </div>
  );
}
