import { useQuery } from "@tanstack/react-query";
import { getPlayersFromTeam } from "@/services/player/playerService";
import type { Player } from "@/interfaces/player.interface";

export const PLAYERS_FROM_TEAM_QUERY_KEY = (slug: string) => ["players", "team", slug];

export const usePlayersFromTeamQuery = (slug: string) => {
  return useQuery<Player[]>({
    queryKey: PLAYERS_FROM_TEAM_QUERY_KEY(slug),
    queryFn: () => getPlayersFromTeam(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
