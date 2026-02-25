import { useQuery } from "@tanstack/react-query";
import { getCoachLeague } from "@/services/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

export const LEAGUE_COACH_LIST_QUERY_KEY = () => ["leagues", "coach"];

export const useCoachLeagueQuery = () => {
  return useQuery<League>({
    queryKey: LEAGUE_COACH_LIST_QUERY_KEY(),
    queryFn: () => getCoachLeague(),
  });
};
