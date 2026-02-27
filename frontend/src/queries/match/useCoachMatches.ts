import { useQuery } from "@tanstack/react-query";
import { getMatchesForCoach } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const COACH_MATCHES_QUERY_KEY = (teamSlug: string) => ["matches", "coach", teamSlug];

export const useCoachMatchesQuery = (teamSlug: string) => {
  return useQuery<Match[]>({
    queryKey: COACH_MATCHES_QUERY_KEY(teamSlug),
    queryFn: () => getMatchesForCoach(teamSlug),
    enabled: !!teamSlug,
  });
};
