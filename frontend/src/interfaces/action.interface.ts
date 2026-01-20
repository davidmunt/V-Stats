export type ActionType = "SERVE" | "RECEPTION" | "SET" | "ATTACK" | "BLOCK" | "ERROR";
export type ResultType = "SUCCESS" | "FAIL" | "ACE" | "BLOCKED" | "ERROR";

export interface Action {
  id_action: string;
  id_match: string;
  id_set: string;
  id_team: string;
  id_player: string;
  id_point_for_team?: string;
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
