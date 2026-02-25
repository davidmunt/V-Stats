import { useQuery } from "@tanstack/react-query";
import { getNextMatchForCoach } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const NEXT_MATCH_COACH_QUERY_KEY = () => ["matches", "next", "coach"];

export const useNextMatchForCoachQuery = () => {
  return useQuery<Match>({
    queryKey: NEXT_MATCH_COACH_QUERY_KEY(),
    queryFn: () => getNextMatchForCoach(),
  });
};
