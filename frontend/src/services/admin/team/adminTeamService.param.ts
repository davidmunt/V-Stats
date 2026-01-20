export interface CreateTeamParam {
  id_venue: string;
  id_league: string;
  name: string;
  image: string;
}

export interface UpdateTeamParam {
  slug: string;
  id_venue: string;
  id_coach: string | null;
  id_analyst: string | null;
  name: string;
  image: string;
  status: string;
  is_active: boolean;
}

export interface DeleteTeamParam {
  slug: string;
}
