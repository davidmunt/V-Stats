import { useQuery } from "@tanstack/react-query";
import { getNextMatchForAnalyst } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const NEXT_MATCH_ANALYST_QUERY_KEY = (slug: string) => ["matches", "next", "analyst", slug];

export const useNextMatchForAnalystQuery = (slug: string) => {
  return useQuery<Match>({
    queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(slug),
    queryFn: () => getNextMatchForAnalyst(slug),
    enabled: !!slug,
  });
};
