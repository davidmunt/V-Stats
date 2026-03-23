export interface LineupPosition {
  slug_lineup_position: string;
  slug_lineup: string;
  slug_team: string;
  slug_player: string;
  dorsal: number;
  is_setter: boolean;
  role: string;
  name: string;
  image: string;
  libero_swap_target: boolean;
  is_on_court: boolean;
  initial_position: number;
  current_position: number;
  status: string;
  is_active: boolean;
}
