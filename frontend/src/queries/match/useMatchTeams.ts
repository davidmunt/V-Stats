import { useQuery } from "@tanstack/react-query";
import { getMatchLineups } from "@/services/lineup/lineupService";
import type { MatchLineupsResponse } from "@/interfaces/lineup.interface";

export const MATCH_TEAMS_QUERY_KEY = (slug: string) => ["match", "lineups", slug];

export const useMatchTeamsQuery = (matchSlug: string) => {
  return useQuery<MatchLineupsResponse>({
    // Definimos que la función devuelve el objeto con home/away
    queryKey: MATCH_TEAMS_QUERY_KEY(matchSlug),
    queryFn: () => getMatchLineups(matchSlug),
    enabled: !!matchSlug,
    staleTime: 1000 * 60 * 5,
    // Ahora 'lineups' es de tipo MatchLineupsResponse y tiene home/away
    select: (lineups) => ({
      home: lineups.home,
      away: lineups.away,
    }),
  });
};

// export const useMatchTeamsQuery = (matchSlug: string) => {
//   return useQuery<Team[]>({
//     queryKey: MATCH_TEAMS_QUERY_KEY(matchSlug),
//     queryFn: () => getTeamsFromMatch(matchSlug),
//     enabled: !!matchSlug,
//     staleTime: 1000 * 60 * 5,
//   });
// };
