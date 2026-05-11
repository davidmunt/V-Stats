import { useQuery } from "@tanstack/react-query";
import { getChartStatsForTeamMatch } from "@/services/stat/statService";

export const useChartStatsTeamMatchQuery = (teamSlug: string, matchSlug: string) => {
  return useQuery({
    queryKey: ["stats", "chart", "team", teamSlug, "match", matchSlug],
    queryFn: () => getChartStatsForTeamMatch(teamSlug, matchSlug),
    select: (data) => data.stats,
    staleTime: 1000 * 60 * 5,
    enabled: !!teamSlug && !!matchSlug,
  });
};
