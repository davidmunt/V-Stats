import { useQuery } from "@tanstack/react-query";
import { getPlayerBySlug } from "@/services/player/playerService";
import type { Player } from "@/interfaces/player.interface";

export const PLAYER_DETAIL_QUERY_KEY = (slug: string) => ["player", "detail", slug];

export const usePlayerBySlugQuery = (slug: string) => {
  return useQuery<Player>({
    queryKey: PLAYER_DETAIL_QUERY_KEY(slug),
    queryFn: () => getPlayerBySlug(slug),
    enabled: !!slug,
  });
};
