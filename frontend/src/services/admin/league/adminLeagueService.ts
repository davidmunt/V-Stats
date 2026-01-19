import apiClient from "@/services/apiClient";
import type { CreateLeagueParam, UpdateLeagueParam, DeleteLeagueParam } from "./adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";

export const createLeague = async ({ name, country, category, season, image }: CreateLeagueParam): Promise<League> => {
  const response = await apiClient.post<League>("/league", {
    name,
    country,
    category,
    season,
    image,
  });
  return response.data;
};

export const updateLeague = async ({ slug, name, country, category, season, image }: UpdateLeagueParam): Promise<League> => {
  const response = await apiClient.put<League>(`/league/${slug}`, {
    name,
    country,
    category,
    season,
    image,
  });
  return response.data;
};

export const deleteLeague = async ({ slug }: DeleteLeagueParam): Promise<void> => {
  await apiClient.delete<void>(`/league/${slug}`);
};

export const getMyLeagues = async (): Promise<League[]> => {
  const response = await apiClient.get<League[]>("/league/my-leagues");
  return response.data;
};

export const getLeagueBySlug = async (slug: string): Promise<League> => {
  const response = await apiClient.get<League>(`/league/${slug}`);
  return response.data;
};
