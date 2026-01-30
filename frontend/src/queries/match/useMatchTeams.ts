import { useQuery } from "@tanstack/react-query";
import { getTeamsFromMatch } from "@/services/match/matchService";
import type { Team } from "@/interfaces/team.interface";

export const MATCH_TEAMS_QUERY_KEY = (slug: string) => ["match", "teams", slug];

export const useMatchTeamsQuery = (matchSlug: string) => {
  return useQuery<Team[]>({
    queryKey: MATCH_TEAMS_QUERY_KEY(matchSlug),
    queryFn: () => getTeamsFromMatch(matchSlug),
    enabled: !!matchSlug,
  });
};
