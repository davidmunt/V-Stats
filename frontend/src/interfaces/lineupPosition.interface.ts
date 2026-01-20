export type LineupPositionStatus = "ACTIVE" | "INACTIVE" | "SUBSTITUTED";

export interface LineupPosition {
  id_lineup_position: string;
  id_lineup: string;
  id_player: string;
  is_on_court: boolean;
  initial_position: number;
  current_position?: number;
  status: LineupPositionStatus;
  is_active: boolean;
}
