import { useQuery } from "@tanstack/react-query";
import { getStatsForTeamMatch } from "@/services/stat/statService";

export const useTypeStatsForTeamMatchQuery = (teamSlug: string, actionType: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "forTeam", teamSlug, actionType, matchSlug],
    queryFn: () => getStatsForTeamMatch(teamSlug, actionType, matchSlug), // Tu API debe soportar esto
    select: (data) => data.stats,
    enabled: !!teamSlug && !!matchSlug,
  });
};
