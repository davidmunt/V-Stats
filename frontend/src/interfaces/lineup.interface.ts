import type { LineupPosition } from "./lineupPosition.interface";

export interface Lineup {
  id_lineup: string;
  id_match: string;
  id_team: string;
  created_at: Date;
  status: string;
  is_active: boolean;
}

export interface LineupWithPositions {
  id_lineup: string;
  id_team: string;
  positions: LineupPosition[];
}

export interface MatchLineupsResponse {
  home: LineupWithPositions;
  away: LineupWithPositions;
}
