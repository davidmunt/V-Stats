export interface LineupPosition {
  id_lineup_position: string;
  id_lineup: string;
  id_team: string;
  id_player: string;
  dorsal: number;
  is_on_court: boolean;
  initial_position: number;
  current_position: number;
  status: string;
  is_active: boolean;
}
