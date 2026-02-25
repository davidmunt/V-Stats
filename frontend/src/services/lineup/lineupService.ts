import apiClient from "@/services/apiClient";
import type { MatchLineupsResponse, Lineup } from "@/interfaces/lineup.interface";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import type { SaveLineupParam, UpdateLineupPositionParam } from "./lineupService.param";

export interface LineupPositionPopulated extends LineupPosition {
  slug: string;
  name: string;
  role: string;
  image: string;
}

export interface SingleLineupResponse {
  lineup: Lineup & { slug: string };
  positions: LineupPositionPopulated[];
}

export interface AllLineupsResponse {
  lineups: {
    slug_lineup: string;
    slug_team: { name: string; slug_team: string };
    positions: LineupPositionPopulated[];
  }[];
}

export const saveLineup = async ({ slug_match, slug_team, positions }: SaveLineupParam): Promise<void> => {
  await apiClient.post("spring", `/api/lineups/${slug_match}`, {
    slug_team,
    positions,
  });
};

export const updateLineupPosition = async ({ slug_position, slug_player }: UpdateLineupPositionParam): Promise<void> => {
  await apiClient.put("express", `/lineup/position/${slug_position}`, {
    slug_player,
  });
};

export const getLineupByTeam = async (slug_match: string, slug_team: string): Promise<SingleLineupResponse> => {
  const response = await apiClient.get<SingleLineupResponse>("spring", `/api/lineups/${slug_match}/${slug_team}`);
  return response.data;
};

export const getMatchLineups = async (slug_match: string): Promise<MatchLineupsResponse> => {
  const response = await apiClient.get<{ lineups: MatchLineupsResponse }>("express", `/lineups/${slug_match}`);
  return response.data.lineups;
};
