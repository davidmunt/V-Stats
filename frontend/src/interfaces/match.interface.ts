export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";

export interface Match {
  id_match: string;
  id_league: string;
  id_team_local: string;
  id_team_visitor: string;
  id_venue: string;
  id_admin_created_by: string;
  date: Date;
  status: MatchStatus;
  current_set: number;
  is_active: boolean;
}
