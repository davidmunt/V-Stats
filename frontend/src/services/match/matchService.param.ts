export interface CreateMatchParam {
  slug_league: string;
  name: string;
  image: string;
  slug_team_local: string;
  slug_team_visitor: string;
  date: Date;
}

export interface UpdateMatchParam {
  slug_match: string;
  slug_league: string;
  name: string;
  image: string;
  slug_team_local: string;
  slug_team_visitor: string;
  date: Date;
  status: string;
  is_active: boolean;
}
