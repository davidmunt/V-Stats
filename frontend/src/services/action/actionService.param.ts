export interface CreateActionParam {
  slug_set: string;
  slug_team?: string;
  slug_player?: string;
  slug_point_for_team: string;
  player_position?: number;
  action_type?: string;
  result?: string;
  start_x?: number;
  start_y?: number;
  end_x?: number;
  end_y?: number;
}
