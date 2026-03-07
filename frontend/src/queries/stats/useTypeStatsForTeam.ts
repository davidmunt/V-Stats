import { useQuery } from "@tanstack/react-query";
import { getStatsForTeam } from "@/services/stat/statService";

export const useTypeStatsForTeamQuery = (teamSlug: string, actionType: string) => {
  return useQuery({
    queryKey: ["stats", "forTeam", teamSlug, actionType],
    queryFn: () => getStatsForTeam(teamSlug, actionType),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!teamSlug && !!actionType,
  });
};
