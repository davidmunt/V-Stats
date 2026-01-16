export type ActionType = "SERVE" | "RECEPTION" | "SET" | "ATTACK" | "BLOCK" | "ERROR";
export type ResultType = "SUCCESS" | "FAIL" | "ACE" | "BLOCKED" | "ERROR";

export interface Action {
  id_action: string;
  id_match: number;
  id_set: number;
  id_team: number;
  id_player: number;
  id_point_for_team?: number;
  player_position: number;
  action_type: ActionType;
  result: ResultType;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  created_at: Date;
  status: string;
  is_active: boolean;
}
