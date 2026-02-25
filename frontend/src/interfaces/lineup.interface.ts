import type { LineupPosition } from "./lineupPosition.interface";

export interface Lineup {
  slug_lineup: string;
  slug_match: string;
  slug_team: string;
  created_at: Date;
  status: string;
  is_active: boolean;
}

export interface LineupWithPositions {
  slug_lineup: string;
  slug_team: string;
  positions: LineupPosition[];
}

export interface MatchLineupsResponse {
  home: LineupWithPositions;
  away: LineupWithPositions;
}
