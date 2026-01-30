import { useQuery } from "@tanstack/react-query";
import { getPlayersFromMatch } from "@/services/player/playerService";
import type { Player } from "@/interfaces/player.interface";

export const PLAYERS_FROM_MATCH_QUERY_KEY = (slug: string) => ["players", "match", slug];

export const usePlayersFromMatchQuery = (slug: string) => {
  return useQuery<Player[]>({
    queryKey: PLAYERS_FROM_MATCH_QUERY_KEY(slug),
    queryFn: () => getPlayersFromMatch(slug),
    enabled: !!slug,
  });
};
