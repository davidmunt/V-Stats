import { useQuery } from "@tanstack/react-query";
import { getChartStatsForTeam } from "@/services/stat/statService";

export const useChartStatsTeamQuery = (teamSlug: string) => {
  return useQuery({
    queryKey: ["stats", "chart", "team", teamSlug],
    queryFn: () => getChartStatsForTeam(teamSlug),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!teamSlug,
  });
};
