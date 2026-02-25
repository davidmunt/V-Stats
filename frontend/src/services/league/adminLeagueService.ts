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

export const createLeague = async ({ name, country, slug_category, image }: CreateLeagueParam): Promise<League> => {
  const response = await apiClient.post<SingleLeagueResponse>("spring", "/api/leagues", {
    name,
    country,
    slug_category,
    image,
  });
  return response.data.league;
};

export const updateLeague = async ({
  slug_league,
  name,
  country,
  slug_category,
  image,
  status,
  is_active,
}: UpdateLeagueParam): Promise<League> => {
  const response = await apiClient.put<SingleLeagueResponse>("spring", `/api/leagues/${slug_league}`, {
    name,
    country,
    slug_category,
    image,
    status,
    is_active,
  });
  return response.data.league;
};

export const deleteLeague = async ({ slug_league }: DeleteLeagueParam): Promise<void> => {
  await apiClient.delete<void>("spring", `/api/leagues/${slug_league}`);
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
  const response = await apiClient.get<LeaguesResponse>("spring", "/api/leagues");
  return response.data.leagues;
};

export const getCoachLeague = async (): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>("fastapi", `/api/leagues/my-league`);
  return response.data.league;
};

export const getLeagueBySlug = async (slug: string): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>("spring", `/api/leagues/${slug}`);
  return response.data.league;
};
