import { useQuery } from "@tanstack/react-query";
import { getMatchesFromLeague } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const MATCHES_LIST_QUERY_KEY = (slug: string) => ["matches", "league", slug];

export const useMatchesQuery = (slug: string) => {
  return useQuery<Match[]>({
    queryKey: MATCHES_LIST_QUERY_KEY(slug),
    queryFn: () => getMatchesFromLeague(slug),
    enabled: !!slug,
  });
};
