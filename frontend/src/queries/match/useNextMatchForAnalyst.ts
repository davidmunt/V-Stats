import { useQuery } from "@tanstack/react-query";
import { getNextMatchForAnalyst } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const NEXT_MATCH_ANALYST_QUERY_KEY = () => ["matches", "next", "analyst"];

export const useNextMatchForAnalystQuery = () => {
  return useQuery<Match>({
    queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(),
    queryFn: () => getNextMatchForAnalyst(),
  });
};
