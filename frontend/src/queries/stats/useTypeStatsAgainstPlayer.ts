import { useQuery } from "@tanstack/react-query";
import { getStatsAgainstPlayer } from "@/services/stat/statService";

export const useTypeStatsAgainstPlayerQuery = (playerSlug: string, actionType: string) => {
  return useQuery({
    queryKey: ["stats", "againstPlayer", playerSlug, actionType],
    queryFn: () => getStatsAgainstPlayer(playerSlug, actionType),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!playerSlug && !!actionType,
  });
};
