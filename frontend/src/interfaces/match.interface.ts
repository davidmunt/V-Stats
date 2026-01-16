export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";

export interface Match {
  id_match: number;
  id_league: number;
  id_team_local: number;
  id_team_visitor: number;
  id_venue: number;
  id_admin_created_by: number;
  date: Date;
  status: MatchStatus;
  current_set: number;
  is_active: boolean;
}
