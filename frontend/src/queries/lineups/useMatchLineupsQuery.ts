import { useQuery } from "@tanstack/react-query";
import { getMatchLineups } from "@/services/lineup/lineupService";
import type { MatchLineupsResponse } from "@/interfaces/lineup.interface";

export const MATCH_LINEUPS_QUERY_KEY = (slug: string) => ["match", "lineups", slug];

export const useMatchLineupsQuery = (matchSlug: string) => {
  return useQuery<MatchLineupsResponse>({
    queryKey: MATCH_LINEUPS_QUERY_KEY(matchSlug),
    queryFn: () => getMatchLineups(matchSlug),
    enabled: !!matchSlug,
  });
};
