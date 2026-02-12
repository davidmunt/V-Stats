import apiClient from "@/services/apiClient";
import type { CreatePlayerParam, UpdatePlayerParam } from "./playerService.param";
import type { Player } from "@/interfaces/player.interface";

interface PlayersResponse {
  players: Player[];
}

interface SinglePlayerResponse {
  player: Player;
}

export const createPlayer = async ({ slug, name, dorsal, role, image }: CreatePlayerParam): Promise<Player> => {
  const response = await apiClient.post<SinglePlayerResponse>("express", "/player", {
    slug,
    name,
    dorsal,
    role,
    image,
  });
  return response.data.player;
};

export const updatePlayer = async ({ slug, name, dorsal, role, image, status, is_active }: UpdatePlayerParam): Promise<Player> => {
  const response = await apiClient.put<SinglePlayerResponse>("express", `/player/${slug}`, {
    name,
    dorsal,
    role,
    image,
    status,
    is_active,
  });
  return response.data.player;
};

export const deletePlayer = async (slug: string): Promise<void> => {
  await apiClient.delete<void>("express", `/player/${slug}`);
};

export const getPlayersFromLeague = async (slug: string): Promise<Player[]> => {
  const response = await apiClient.get<PlayersResponse>("express", `/team/${slug}/players`);
  return response.data.players;
};

export const getPlayersFromCoach = async (slug: string): Promise<Player[]> => {
  const response = await apiClient.get<PlayersResponse>("express", `/coach/${slug}/players`);
  return response.data.players;
};

export const getPlayersFromAnalist = async (slug: string): Promise<Player[]> => {
  const response = await apiClient.get<PlayersResponse>("express", `/coach/${slug}/players`);
  return response.data.players;
};

export const getPlayersFromMatch = async (slug: string): Promise<Player[]> => {
  const response = await apiClient.get<PlayersResponse>("express", `/match/${slug}/players`);
  return response.data.players;
};

export const getPlayerBySlug = async (slug: string): Promise<Player> => {
  const response = await apiClient.get<SinglePlayerResponse>("express", `/player/${slug}`);
  return response.data.player;
};
