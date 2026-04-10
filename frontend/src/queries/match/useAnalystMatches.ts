import { useQuery } from "@tanstack/react-query";
import { getMatchesForAnalyst } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const ANALYST_MATCHES_QUERY_KEY = () => ["matches", "analyst"];

export const useAnalystMatchesQuery = () => {
  return useQuery<Match[]>({
    queryKey: ANALYST_MATCHES_QUERY_KEY(),
    queryFn: () => getMatchesForAnalyst(),
    staleTime: 1000 * 60 * 5,
  });
};
