export interface Set {
  slug: string;
  id_set: string;
  id_match: string;
  set_number: number;
  local_points: number;
  visitor_points: number;
  finished_at: Date;
  status: string;
  is_active: boolean;
}
