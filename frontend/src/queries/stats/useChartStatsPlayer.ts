import { useQuery } from "@tanstack/react-query";
import { getChartStatsForPlayer } from "@/services/stat/statService";

export const useChartStatsPlayerQuery = (playerSlug: string) => {
  return useQuery({
    queryKey: ["stats", "chart", "player", playerSlug],
    queryFn: () => getChartStatsForPlayer(playerSlug),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!playerSlug,
  });
};
