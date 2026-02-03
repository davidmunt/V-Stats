import { useQuery } from "@tanstack/react-query";
import { getStatsFromTeam } from "@/services/stat/statService";

export const STATS_QUERY_KEY = ["stats"];

export const useStatsQuery = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStatsFromTeam,
  });
};
