export interface Stat {
  slug_match: string;
  slug_set: string;
  set_number: number;
  slug_team: string;
  slug_player: string;
  player_name: string;
  player_dorsal: number;
  player_position: number;
  action_type: string;
  result: string;
  slug_point_for_team: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  timestamp: string;
}

export interface chartStat {
  percentage_serve_double_plus: number;
  percentage_serve_plus: number;
  percentage_serve_minus: number;
  percentage_serve_double_minus: number;
  percentage_attack_double_plus: number;
  percentage_attack_plus: number;
  percentage_attack_minus: number;
  percentage_attack_double_minus: number;
  percentage_block_double_plus: number;
  percentage_block_plus: number;
  percentage_block_minus: number;
  percentage_block_double_minus: number;
  percentage_reception_double_plus: number;
  percentage_reception_plus: number;
  percentage_reception_minus: number;
  percentage_reception_double_minus: number;
  percentage_colocacion_double_plus: number;
  percentage_colocacion_plus: number;
  percentage_colocacion_minus: number;
  percentage_colocacion_double_minus: number;
  percentage_defensa_double_plus: number;
  percentage_defensa_plus: number;
  percentage_defensa_minus: number;
  percentage_defensa_double_minus: number;
}
