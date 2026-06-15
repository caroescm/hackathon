import { createClient, createServiceClient } from "@/lib/supabase/server";
import DocumentosCliente from "./DocumentosCliente";

type Documento = {
  id: string;
  nombre: string;
  estado: string;
  subido_en: string;
  pasos: { nombre: string } | null;
};

export default async function DocumentosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const service = createServiceClient();
  const { data } = user
    ? await service
        .from("documentos")
        .select("id, nombre, estado, subido_en, pasos(nombre)")
        .eq("paciente_id", user.id)
        .order("subido_en", { ascending: false })
    : { data: null };

  const documentos = (data as Documento[] | null) ?? [];

  return <DocumentosCliente documentos={documentos} />;
}
