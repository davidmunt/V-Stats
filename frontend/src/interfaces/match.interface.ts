export interface Match {
  id_match: string;
  slug: string;
  name: string;
  image: string;
  id_league: string;
  id_team_local: string;
  id_team_visitor: string;
  id_venue: string;
  date: Date;
  status: string;
  current_set: number;
  is_active: boolean;
}
