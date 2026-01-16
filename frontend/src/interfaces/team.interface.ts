export type TeamStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Team {
  id_team: number;
  id_venue: number;
  id_coach: number | null;
  id_analyst: number | null;
  id_league: number;
  name: string;
  category: string;
  image: string;
  created_at: Date;
  status: TeamStatus;
  is_active: boolean;
}
