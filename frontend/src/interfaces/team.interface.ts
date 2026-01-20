export type TeamStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Team {
  id_team: string;
  id_venue: string;
  id_coach: string | null;
  id_analyst: string | null;
  id_league: string;
  name: string;
  category: string;
  image: string;
  created_at: Date;
  status: TeamStatus;
  is_active: boolean;
}
