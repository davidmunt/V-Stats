import apiClient from "@/services/apiClient";
import type { Lineup } from "@/interfaces/lineup.interface";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import type { Player } from "@/interfaces/player.interface";
import type { SaveLineupParam, UpdateLineupPositionParam } from "./lineupService.param";

export interface LineupPositionPopulated extends Omit<LineupPosition, "id_player"> {
  slug: string;
  player: Player;
}

export interface SingleLineupResponse {
  lineup: Lineup & { slug: string };
  positions: LineupPositionPopulated[];
}

export interface AllLineupsResponse {
  lineups: {
    id_lineup: string;
    team_id: { name: string; slug: string };
    positions: LineupPositionPopulated[];
  }[];
}

export const saveLineup = async ({ matchSlug, teamSlug, positions }: SaveLineupParam): Promise<void> => {
  await apiClient.post(`/lineup/${matchSlug}/${teamSlug}`, {
    positions,
  });
};

export const updateLineupPosition = async ({ positionSlug, player_id }: UpdateLineupPositionParam): Promise<void> => {
  await apiClient.put(`/lineup/position/${positionSlug}`, {
    player_id,
  });
};

export const getLineupByTeam = async (matchSlug: string, teamSlug: string): Promise<SingleLineupResponse> => {
  const response = await apiClient.get<SingleLineupResponse>(`/lineup/${matchSlug}/${teamSlug}`);
  return response.data;
};

export const getMatchLineups = async (matchSlug: string): Promise<AllLineupsResponse> => {
  const response = await apiClient.get<AllLineupsResponse>(`/lineups/${matchSlug}`);
  return response.data;
};
