import apiClient from "@/services/apiClient";
import type { CreateLeagueParam, UpdateLeagueParam, DeleteLeagueParam } from "./adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";

interface LeaguesResponse {
  leagues: League[];
}

interface SingleLeagueResponse {
  league: League;
}

export const createLeague = async ({ name, country, category, season, image }: CreateLeagueParam): Promise<League> => {
  const response = await apiClient.post<SingleLeagueResponse>("/league", {
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
  const response = await apiClient.put<SingleLeagueResponse>(`/league/${slug}`, {
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
  await apiClient.delete<void>(`/league/${slug}`);
};

export const getMyLeagues = async (): Promise<League[]> => {
  const response = await apiClient.get<LeaguesResponse>("/league/my-leagues");
  return response.data.leagues;
};

export const getCoachLeague = async (slug: string): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>(`/league/coach/${slug}`);
  return response.data.league;
};

export const getLeagueBySlug = async (slug: string): Promise<League> => {
  const response = await apiClient.get<SingleLeagueResponse>(`/league/${slug}`);
  return response.data.league;
};
