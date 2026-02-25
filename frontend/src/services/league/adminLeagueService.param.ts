export interface CreateLeagueParam {
  name: string;
  country: string;
  slug_category: string;
  image?: string;
}

export interface UpdateLeagueParam {
  slug_league: string;
  name: string;
  country: string;
  slug_category: string;
  image?: string;
  status: string;
  is_active: boolean;
}

export interface GetFilteredLeagueParam {
  slug_category?: string;
  name?: string;
  status?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface DeleteLeagueParam {
  slug_league: string;
}
