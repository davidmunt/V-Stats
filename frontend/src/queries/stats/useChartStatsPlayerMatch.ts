import { useQuery } from "@tanstack/react-query";
import { getChartStatsForPlayerMatch } from "@/services/stat/statService";

export const useChartStatsPlayerMatchQuery = (playerSlug: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "chart", "player", playerSlug, "match", matchSlug],
    queryFn: () => getChartStatsForPlayerMatch(playerSlug, matchSlug),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!playerSlug && !!matchSlug,
  });
};
