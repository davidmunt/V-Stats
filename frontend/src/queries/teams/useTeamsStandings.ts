import { useQuery } from "@tanstack/react-query";
import { getTeamsStandingsFromLeague } from "@/services/team/adminTeamService";
import type { TeamStanding } from "@/interfaces/teamStanding.interface";

export const TEAMS_STANDINGS_LIST_QUERY_KEY = (slug: string) => ["teamsStandings", "league", slug];

export const useTeamsStandingsQuery = (slug: string) => {
  return useQuery<TeamStanding[]>({
    queryKey: TEAMS_STANDINGS_LIST_QUERY_KEY(slug),
    queryFn: () => getTeamsStandingsFromLeague(slug),
    enabled: !!slug,
  });
};
