import { useQuery } from "@tanstack/react-query";
import { getLeagueBySlug } from "@/services/admin/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

// Factory para generar keys consistentes: ['leagues', 'detail', 'mi-liga']
export const LEAGUE_DETAIL_QUERY_KEY = (slug: string) => ["leagues", "detail", slug];

export const useLeagueBySlugQuery = (slug: string) => {
  return useQuery<League>({
    queryKey: LEAGUE_DETAIL_QUERY_KEY(slug),
    queryFn: () => getLeagueBySlug(slug),
    enabled: !!slug, // IMPORTANTE: Solo ejecuta la query si hay un slug (evita llamadas con string vacío)
    retry: 1, // Si falla, reintenta solo 1 vez (útil para 404s)
  });
};
