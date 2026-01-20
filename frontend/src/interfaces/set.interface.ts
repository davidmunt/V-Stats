export type SetStatus = "PENDING" | "IN_PROGRESS" | "FINISHED";

export interface Set {
  id_set: string;
  id_match: string;
  set_number: number;
  local_points: number;
  visitor_points: number;
  finished_at: Date;
  status: SetStatus;
  is_active: boolean;
}
