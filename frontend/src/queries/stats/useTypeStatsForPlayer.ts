import { useQuery } from "@tanstack/react-query";
import { getStatsForPlayer } from "@/services/stat/statService";

export const useTypeStatsForPlayerQuery = (playerSlug: string, actionType: string) => {
  return useQuery({
    queryKey: ["stats", "forPlayer", playerSlug, actionType],
    queryFn: () => getStatsForPlayer(playerSlug, actionType),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!playerSlug && !!actionType,
  });
};
