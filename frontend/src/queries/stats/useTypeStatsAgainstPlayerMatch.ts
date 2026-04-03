import { useQuery } from "@tanstack/react-query";
import { getStatsAgainstPlayerTeamMatch } from "@/services/stat/statService";

export const useTypeStatsAgainstPlayerMatchQuery = (playerSlug: string, actionType: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "againstPlayer", playerSlug, actionType, matchSlug],
    queryFn: () => getStatsAgainstPlayerTeamMatch(playerSlug, actionType, matchSlug),
    select: (data) => data.stats,
    enabled: !!playerSlug && !!matchSlug,
  });
};
