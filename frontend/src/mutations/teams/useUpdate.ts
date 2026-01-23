import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeam } from "@/services/team/adminTeamService";
import type { UpdateTeamParam } from "@/services/team/adminTeamService.param";
import type { Team } from "@/interfaces/team.interface";
import { TEAMS_LIST_QUERY_KEY } from "@/queries/teams/useTeams";
import { TEAMS_DETAIL_QUERY_KEY } from "@/queries/teams/useTeamBySlug";

export const useUpdateTeamMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeamParam) => updateTeam(data),
    onSuccess: (updatedTeam) => {
      queryClient.setQueryData<Team[]>(TEAMS_LIST_QUERY_KEY(leagueSlug), (oldTeams) => {
        return oldTeams?.map((t) => (t.slug === updatedTeam.slug ? updatedTeam : t));
      });
      queryClient.setQueryData(TEAMS_DETAIL_QUERY_KEY(updatedTeam.slug), updatedTeam);
    },
  });
};
