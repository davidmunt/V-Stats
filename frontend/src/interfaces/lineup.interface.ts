export type LineupStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface Lineup {
  id_lineup: number;
  id_match: number;
  id_team: number;
  created_at: Date;
  status: LineupStatus;
  is_active: boolean;
}
