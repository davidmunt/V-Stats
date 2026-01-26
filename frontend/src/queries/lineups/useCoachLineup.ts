import { useQuery } from "@tanstack/react-query";
import { getLineupByTeam } from "@/services/lineup/lineupService";
import type { SingleLineupResponse } from "@/services/lineup/lineupService";

export const COACH_LINEUP_QUERY_KEY = (matchSlug: string, teamSlug: string) => ["lineup", matchSlug, teamSlug];

export const useCoachLineupQuery = (matchSlug: string, teamSlug: string) => {
  return useQuery<SingleLineupResponse>({
    queryKey: COACH_LINEUP_QUERY_KEY(matchSlug, teamSlug),
    queryFn: () => getLineupByTeam(matchSlug, teamSlug),
    enabled: !!matchSlug && !!teamSlug,
  });
};
