import { useQuery } from "@tanstack/react-query";
import { getTeamsFromLeague } from "@/services/team/adminTeamService";
import type { Team } from "@/interfaces/team.interface";

export const TEAMS_LIST_QUERY_KEY = (slug: string) => ["teams", "league", slug];

export const useTeamsQuery = (slug: string) => {
  return useQuery<Team[]>({
    queryKey: TEAMS_LIST_QUERY_KEY(slug),
    queryFn: () => getTeamsFromLeague(slug),
    enabled: !!slug,
  });
};
