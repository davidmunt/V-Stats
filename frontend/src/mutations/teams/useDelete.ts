import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeam } from "@/services/team/adminTeamService";
import { TEAMS_LIST_QUERY_KEY } from "@/queries/teams/useTeams";
import { TEAMS_DETAIL_QUERY_KEY } from "@/queries/teams/useTeamBySlug";

export const useDeleteTeamMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => deleteTeam({ slug }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: TEAMS_LIST_QUERY_KEY(leagueSlug),
      });
      queryClient.removeQueries({
        queryKey: TEAMS_DETAIL_QUERY_KEY(variables.slug),
      });
    },
  });
};
