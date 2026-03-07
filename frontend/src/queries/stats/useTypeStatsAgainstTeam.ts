import { useQuery } from "@tanstack/react-query";
import { getStatsAgainstTeam } from "@/services/stat/statService";

export const useTypeStatsAgainstTeamQuery = (teamSlug: string, actionType: string) => {
  return useQuery({
    queryKey: ["stats", "againstTeam", teamSlug, actionType],
    queryFn: () => getStatsAgainstTeam(teamSlug, actionType),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!teamSlug && !!actionType,
  });
};
