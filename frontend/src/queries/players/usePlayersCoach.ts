import { useQuery } from "@tanstack/react-query";
import { getPlayersFromCoach } from "@/services/player/playerService";
import type { Player } from "@/interfaces/player.interface";

export const PLAYERS_COACH_LIST_KEY = (coachSlug: string) => ["players", "coach", coachSlug];

export const usePlayersCoachQuery = (coachSlug: string) => {
  return useQuery<Player[]>({
    queryKey: PLAYERS_COACH_LIST_KEY(coachSlug),
    queryFn: () => getPlayersFromCoach(coachSlug),
    enabled: !!coachSlug,
  });
};
