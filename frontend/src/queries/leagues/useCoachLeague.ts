import { useQuery } from "@tanstack/react-query";
import { getCoachLeague } from "@/services/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

export const LEAGUE_COACH_LIST_QUERY_KEY = (slug: string) => ["leagues", "coach", slug];

export const useCoachLeagueQuery = (slug: string) => {
  return useQuery<League>({
    queryKey: LEAGUE_COACH_LIST_QUERY_KEY(slug),
    queryFn: () => getCoachLeague(slug),
    enabled: !!slug,
  });
};
