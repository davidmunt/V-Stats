import { useQuery } from "@tanstack/react-query";
import { getStatsAgainstTeamMatch } from "@/services/stat/statService";

export const useTypeStatsAgainstTeamMatchQuery = (teamSlug: string, actionType: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "againstTeam", teamSlug, actionType, matchSlug],
    queryFn: () => getStatsAgainstTeamMatch(teamSlug, actionType, matchSlug),
    select: (data) => data.stats,
    enabled: !!teamSlug && !!matchSlug,
  });
};
