export interface CreateActionParam {
  slug: string;
  id_team?: string;
  id_player?: string;
  id_point_for_team: string;
  player_position?: number;
  action_type?: string;
  result?: string;
  start_x?: number;
  start_y?: number;
  end_x?: number;
  end_y?: number;
}
