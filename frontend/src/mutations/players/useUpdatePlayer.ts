import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlayer } from "@/services/player/playerService";
import type { UpdatePlayerParam } from "@/services/player/playerService.param";
import type { Player } from "@/interfaces/player.interface";
import { PLAYERS_COACH_LIST_KEY } from "@/queries/players/usePlayersCoach";
import { PLAYER_DETAIL_QUERY_KEY } from "@/queries/players/usePlayerBySlug";

export const useUpdatePlayerMutation = (coachSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePlayerParam) => updatePlayer(data),
    onSuccess: (updatedPlayer) => {
      queryClient.setQueryData<Player[]>(PLAYERS_COACH_LIST_KEY(coachSlug), (oldPlayers) => {
        return oldPlayers?.map((p) => (p.slug === updatedPlayer.slug ? updatedPlayer : p));
      });
      queryClient.setQueryData(PLAYER_DETAIL_QUERY_KEY(updatedPlayer.slug), updatedPlayer);
    },
  });
};
