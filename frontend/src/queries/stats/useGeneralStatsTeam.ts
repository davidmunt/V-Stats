import { useQuery } from "@tanstack/react-query";
import { getGeneralStatsForTeam } from "@/services/stat/statService";

export const useGeneralStatsTeamQuery = (teamSlug: string) => {
  return useQuery({
    queryKey: ["stats", "general", teamSlug],
    queryFn: () => getGeneralStatsForTeam(teamSlug),
    select: (data) => data,
    staleTime: 1000 * 60 * 5,
    enabled: !!teamSlug,
  });
};
