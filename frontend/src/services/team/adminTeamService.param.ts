export interface CreateTeamParam {
  slug_venue: string;
  slug_league: string;
  name: string;
  image: string;
}

export interface UpdateTeamParam {
  slug_team: string;
  slug_venue: string;
  slug_coach: string | null;
  slug_analyst: string | null;
  name: string;
  image: string;
  status: string;
  is_active: boolean;
}

export interface DeleteTeamParam {
  slug_team: string;
}
