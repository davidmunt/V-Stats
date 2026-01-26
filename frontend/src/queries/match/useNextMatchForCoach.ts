import { useQuery } from "@tanstack/react-query";
import { getNextMatchForCoach } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const NEXT_MATCH_COACH_QUERY_KEY = (slug: string) => ["matches", "next", "coach", slug];

export const useNextMatchForCoachQuery = (slug: string) => {
  return useQuery<Match>({
    queryKey: NEXT_MATCH_COACH_QUERY_KEY(slug),
    queryFn: () => getNextMatchForCoach(slug),
    enabled: !!slug,
  });
};
