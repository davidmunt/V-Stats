export type SetStatus = "PENDING" | "IN_PROGRESS" | "FINISHED";

export interface Set {
  id_set: number;
  id_match: number;
  set_number: number;
  local_points: number;
  visitor_points: number;
  finished_at: Date;
  status: SetStatus;
  is_active: boolean;
}
