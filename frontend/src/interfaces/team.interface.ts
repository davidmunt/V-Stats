export interface Team {
  id_team: string;
  id_venue: string;
  id_coach: string | null;
  id_analyst: string | null;
  id_league: string;
  slug: string;
  name: string;
  image: string;
  created_at: Date;
  status: string;
  is_active: boolean;
}
