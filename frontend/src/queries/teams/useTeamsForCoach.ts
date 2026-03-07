import { useQuery } from "@tanstack/react-query";
import { getTeamsFromCoach } from "@/services/team/adminTeamService";
import type { Team } from "@/interfaces/team.interface";

export const TEAMS_LIST_QUERY_KEY = () => ["teams", "coach", "list"];

export const useTeamsQuery = () => {
  return useQuery<Team[]>({
    queryKey: TEAMS_LIST_QUERY_KEY(),
    queryFn: () => getTeamsFromCoach(),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};
