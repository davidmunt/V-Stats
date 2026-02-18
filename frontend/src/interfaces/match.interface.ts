export interface Match {
  slug_match: string;
  name: string;
  image: string;
  slug_league: string;
  slug_team_local: string;
  slug_team_visitor: string;
  slug_venue: string;
  date: Date;
  status: string;
  current_set: number;
  is_active: boolean;
}
