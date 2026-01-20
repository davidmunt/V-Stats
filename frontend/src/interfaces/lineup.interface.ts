export type LineupStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface Lineup {
  id_lineup: string;
  id_match: string;
  id_team: string;
  created_at: Date;
  status: LineupStatus;
  is_active: boolean;
}
