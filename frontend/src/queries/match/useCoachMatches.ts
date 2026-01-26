import { useQuery } from "@tanstack/react-query";
import { getMatchesForCoach } from "@/services/match/matchService";
import type { Match } from "@/interfaces/match.interface";

export const COACH_MATCHES_QUERY_KEY = (coachSlug: string) => ["matches", "coach", coachSlug];

export const useCoachMatchesQuery = (coachSlug: string) => {
  return useQuery<Match[]>({
    queryKey: COACH_MATCHES_QUERY_KEY(coachSlug),
    queryFn: () => getMatchesForCoach(coachSlug),
    enabled: !!coachSlug,
  });
};
