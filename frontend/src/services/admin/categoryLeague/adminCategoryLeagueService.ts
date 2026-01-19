import apiClient from "@/services/apiClient";
import type { CreateCategoryLeagueParam, DeleteCategoryLeagueParam, UpdateCategoryLeagueParam } from "./adminCategoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

export const createCategoryLeague = async ({ name, description, image }: CreateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.post<CategoryLeague>("/categories", {
    name,
    description,
    image,
  });
  return response.data;
};

export const updateCategoryLeague = async ({
  slug,
  name,
  description,
  image,
  status,
  isActive,
}: UpdateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.put<CategoryLeague>(`/categories/${slug}`, {
    name,
    description,
    image,
    status,
    isActive,
  });
  return response.data;
};

export const deleteCategoryLeague = async ({ slug }: DeleteCategoryLeagueParam): Promise<void> => {
  await apiClient.delete<void>(`/categories/${slug}`);
};

export const getMyCategoryLeagues = async (): Promise<CategoryLeague[]> => {
  const response = await apiClient.get<CategoryLeague[]>("/categories/my-categories");
  return response.data;
};

export const getCategoryLeagueBySlug = async (slug: string): Promise<CategoryLeague> => {
  const response = await apiClient.get<CategoryLeague>(`/categories/${slug}`);
  return response.data;
};
