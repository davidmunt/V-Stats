import { useQuery } from "@tanstack/react-query";
import { getMatchDetails } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const MATCH_QUERY_KEY = (slug: string) => ["match", slug];

export const useMatchQuery = (slug: string) => {
  return useQuery<Match>({
    queryKey: MATCH_QUERY_KEY(slug),
    queryFn: () => getMatchDetails(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
