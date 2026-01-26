import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlayer } from "@/services/player/playerService";
import { PLAYERS_COACH_LIST_KEY } from "@/queries/players/usePlayersCoach";
import { PLAYER_DETAIL_QUERY_KEY } from "@/queries/players/usePlayerBySlug";

export const useDeletePlayerMutation = (coachSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => deletePlayer(slug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PLAYERS_COACH_LIST_KEY(coachSlug),
      });
      queryClient.removeQueries({
        queryKey: PLAYER_DETAIL_QUERY_KEY(variables.slug),
      });
    },
  });
};
