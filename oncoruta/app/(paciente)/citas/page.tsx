import { createClient } from "@/lib/supabase/server";
import CitasCliente from "./CitasCliente";

type Cita = {
  id: string;
  servicio: string;
  fecha: string;
  hora: string | null;
  piso: string | null;
  estado: string;
};

export default async function CitasPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("citas")
        .select("id, servicio, fecha, hora, piso, estado")
        .eq("paciente_id", user.id)
        .order("fecha", { ascending: true })
    : { data: null };

  const citas = (data as Cita[] | null) ?? [];
  const proximas = citas.filter((c) => c.estado !== "completada");
  const pasadas  = citas.filter((c) => c.estado === "completada");

  return <CitasCliente proximas={proximas} pasadas={pasadas} />;
}
