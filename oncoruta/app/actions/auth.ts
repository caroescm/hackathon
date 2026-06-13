"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function getRolAction(userId: string): Promise<string> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("id", userId)
    .single();
  return data?.rol ?? "paciente";
}
