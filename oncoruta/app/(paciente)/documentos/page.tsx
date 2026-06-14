import { createClient } from "@/lib/supabase/server";
import DocumentosCliente from "./DocumentosCliente";

type Documento = {
  id: string;
  nombre: string;
  estado: string;
  created_at: string;
  pasos: { nombre: string } | null;
};

export default async function DocumentosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase
        .from("documentos")
        .select("id, nombre, estado, created_at, pasos(nombre)")
        .eq("paciente_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  const documentos = (data as Documento[] | null) ?? [];

  return <DocumentosCliente documentos={documentos} />;
}
