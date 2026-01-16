export type LineupPositionStatus = "ACTIVE" | "INACTIVE" | "SUBSTITUTED";

export interface LineupPosition {
  id_lineup_position: number;
  id_lineup: number;
  id_player: number;
  is_on_court: boolean;
  initial_position: number;
  current_position?: number;
  status: LineupPositionStatus;
  is_active: boolean;
}
