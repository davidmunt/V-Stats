import { useQuery } from "@tanstack/react-query";
import { getStatsForPlayerTeamMatch } from "@/services/stat/statService";

export const useTypeStatsForPlayerMatchQuery = (playerSlug: string, actionType: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "forPlayer", playerSlug, actionType, matchSlug],
    queryFn: () => getStatsForPlayerTeamMatch(playerSlug, actionType, matchSlug),
    select: (data) => data.stats,
    enabled: !!playerSlug && !!matchSlug,
  });
};
