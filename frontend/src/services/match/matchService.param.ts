export interface CreateMatchParam {
  slug: string;
  name: string;
  image: string;
  id_team_local: string;
  id_team_visitor: string;
  date: Date;
}

export interface UpdateMatchParam {
  slug: string;
  matchSlug: string;
  name: string;
  image: string;
  id_team_local: string;
  id_team_visitor: string;
  date: Date;
  status: string;
  is_active: boolean;
}
