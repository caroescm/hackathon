type PerfilVulnerabilidad = {
  jefa_hogar: boolean | null;
  de_provincia: boolean | null;
  tiene_discapacidad: boolean | null;
  habla_quechua: boolean | null;
} | null;

export type Prioridad = "ALTA" | "MEDIA" | "BAJA";

export function getPrioridad(perfil: PerfilVulnerabilidad): Prioridad {
  if (!perfil) return "BAJA";

  const { tiene_discapacidad, de_provincia, jefa_hogar, habla_quechua } = perfil;

  if (tiene_discapacidad || (de_provincia && jefa_hogar)) return "ALTA";
  if (jefa_hogar || de_provincia || habla_quechua) return "MEDIA";
  return "BAJA";
}
