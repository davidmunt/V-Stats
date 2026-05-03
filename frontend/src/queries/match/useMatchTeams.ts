import { useQuery } from "@tanstack/react-query";
import { getMatchLineups } from "@/services/lineup/lineupService";
import type { MatchLineupsResponse } from "@/interfaces/lineup.interface";

export const MATCH_TEAMS_QUERY_KEY = (slug: string) => ["match", "lineups", slug];

export const useMatchTeamsQuery = (matchSlug: string) => {
  return useQuery<MatchLineupsResponse>({
    queryKey: MATCH_TEAMS_QUERY_KEY(matchSlug),
    queryFn: () => getMatchLineups(matchSlug),
    enabled: !!matchSlug,
    staleTime: 1000 * 60 * 5,
    select: (lineups) => ({
      home: lineups.home,
      away: lineups.away,
    }),
  });
};
