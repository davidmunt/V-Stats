import { useQuery } from "@tanstack/react-query";
import { getLeagueBySlug } from "@/services/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

export const LEAGUE_DETAIL_QUERY_KEY = (slug: string) => ["leagues", "detail", slug];

export const useLeagueBySlugQuery = (slug: string) => {
  return useQuery<League>({
    queryKey: LEAGUE_DETAIL_QUERY_KEY(slug),
    queryFn: () => getLeagueBySlug(slug),
    enabled: !!slug,
  });
};
