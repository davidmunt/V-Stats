import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "@/services/team/adminTeamService";
import type { CreateTeamParam } from "@/services/team/adminTeamService.param";
import type { Team } from "@/interfaces/team.interface";
import { TEAMS_LIST_QUERY_KEY } from "@/queries/teams/useTeams";

export const useCreateTeamMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamParam) => createTeam(data),
    onSuccess: (newTeam) => {
      queryClient.setQueryData<Team[]>(TEAMS_LIST_QUERY_KEY(leagueSlug), (oldTeams) => {
        if (!oldTeams) return [newTeam];
        return [...oldTeams, newTeam];
      });
    },
  });
};
