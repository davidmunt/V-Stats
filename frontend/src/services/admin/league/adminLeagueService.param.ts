export interface CreateLeagueParam {
  name: string;
  country: string;
  category: string;
  season: string;
  image?: string;
}

export interface UpdateLeagueParam {
  slug: string;
  name: string;
  country: string;
  category: string;
  season: string;
  image?: string;
}

export interface DeleteLeagueParam {
  slug: string;
}
