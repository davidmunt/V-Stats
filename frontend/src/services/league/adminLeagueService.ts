import apiClient from "@/services/apiClient";
import type { CreateLeagueParam, UpdateLeagueParam, DeleteLeagueParam, GetFilteredLeagueParam } from "./adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { buildQuery } from "@/utils/buildQuery";

interface LeaguesResponse {
  leagues: League[];
}

interface SingleLeagueResponse {
  league: League;
}

export interface LeaguesFilteredResponse {
  leagues: League[];
  total: number;
  page: number;
  total_pages: number;
  sort: string;
  filters_applied: {
    status: string;
    category: string;
    q: string;
  };
}

export const createLeague = async ({ name, country, category, season, image }: CreateLeagueParam): Promise<League> => {
  const response = await apiClient.post<SingleLeagueResponse>("express", "/league", {
    name,
    country,
    category,
    season,
    image,
  });
  return response.data.league;
};

export const updateLeague = async ({
  slug,
  name,
  country,
  category,
  season,
  image,
  status,
  is_active,
}: UpdateLeagueParam): Promise<League> => {
  const response = await apiClient.put<SingleLeagueResponse>("express", `/league/${slug}`, {
    name,
    country,
    category,
    season,
    image,
    status,
    is_active,
  });
  return response.data.league;
};

export const deleteLeague = async ({ slug }: DeleteLeagueParam): Promise<void> => {
  await apiClient.delete<void>("express", `/league/${slug}`);
};

export const getFilteredLeagues = async (params: GetFilteredLeagueParam): Promise<LeaguesFilteredResponse> => {
  const queryData = {
    q: params.name,
    category: params.slug_category,
    status: params.status,
    sort: params.sort,
    page: params.page,
    size: params.size,
  };

  const queryString = buildQuery(queryData);
  const response = await apiClient.get<LeaguesFilteredResponse>("spring", `/api/leagues${queryString}`);
  return response.data;
};

export const getMyLeagues = async (): Promise<League[]> => {
  const response = await apiClient.get<LeaguesResponse>("express", "/league/my-leagues");
  return response.data.leagues;
};

export const getCoachLeague = async (slug: string): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>("express", `/league/coach/${slug}`);
  return response.data.league;
};

export const getLeagueBySlug = async (slug: string): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>("express", `/league/${slug}`);
  return response.data.league;
};
