import { useQuery } from "@tanstack/react-query";
import { getStatsFromTeam } from "@/services/stat/statService";

export const STATS_QUERY_KEY = ["stats"];

export const useStatsQuery = (teamSlug: string, actionType: string) => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => getStatsFromTeam(teamSlug, actionType),
    staleTime: 1000 * 60 * 5,
  });
};
