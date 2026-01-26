import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "@/services/player/playerService";
import type { CreatePlayerParam } from "@/services/player/playerService.param";
import type { Player } from "@/interfaces/player.interface";
import { PLAYERS_COACH_LIST_KEY } from "@/queries/players/usePlayersCoach";

export const useCreatePlayerMutation = (coachSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlayerParam) => createPlayer(data),
    onSuccess: (newPlayer) => {
      queryClient.setQueryData<Player[]>(PLAYERS_COACH_LIST_KEY(coachSlug), (oldPlayers) => {
        if (!oldPlayers) return [newPlayer];
        return [...oldPlayers, newPlayer];
      });
    },
  });
};
