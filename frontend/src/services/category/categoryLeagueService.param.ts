export interface CreateCategoryLeagueParam {
  name: string;
  description: string;
  image: string;
}

export interface UpdateCategoryLeagueParam {
  slug_category: string;
  name: string;
  description: string;
  image: string;
  status: string;
  is_active: boolean;
}

export interface DeleteCategoryLeagueParam {
  slug_category: string;
}
