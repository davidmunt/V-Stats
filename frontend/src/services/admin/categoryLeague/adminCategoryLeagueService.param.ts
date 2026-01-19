export interface CreateCategoryLeagueParam {
  name: string;
  description: string;
  image: string;
}

export interface UpdateCategoryLeagueParam {
  slug: string;
  name: string;
  description: string;
  image: string;
  status: string;
  isActive: boolean;
}

export interface DeleteCategoryLeagueParam {
  slug: string;
}
