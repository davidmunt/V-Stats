export interface Team {
  slug_team: string;
  slug_venue: string;
  slug_coach: string | null;
  slug_analyst: string | null;
  slug_league: string;
  name: string;
  image: string;
  created_at: Date;
  status: string;
  is_active: boolean;
}
