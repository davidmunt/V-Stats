import apiClient from "@/services/apiClient";
import type { CreateCategoryLeagueParam, DeleteCategoryLeagueParam, UpdateCategoryLeagueParam } from "./categoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

interface CategoriesResponse {
  categories: CategoryLeague[];
}

interface SingleCategoryResponse {
  category: CategoryLeague;
}

export const createCategoryLeague = async ({ name, description, image }: CreateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.post<SingleCategoryResponse>("spring", "/api/categories", {
    name,
    description,
    image,
  });
  return response.data.category;
};

export const updateCategoryLeague = async ({
  slug_category,
  name,
  description,
  image,
  status,
  is_active,
}: UpdateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.put<SingleCategoryResponse>("spring", `/api/categories/${slug_category}`, {
    name,
    description,
    image,
    status,
    is_active,
  });
  return response.data.category;
};

export const deleteCategoryLeague = async ({ slug_category }: DeleteCategoryLeagueParam): Promise<void> => {
  await apiClient.delete<void>("spring", `/api/categories/${slug_category}`);
};

export const getMyCategoryLeagues = async (): Promise<CategoryLeague[]> => {
  const response = await apiClient.get<CategoriesResponse>("spring", "/api/categories");
  return response.data.categories;
};

export const getCategoryLeagueBySlug = async (slug: string): Promise<CategoryLeague> => {
  const response = await apiClient.get<SingleCategoryResponse>("spring", `/api/categories/${slug}`);
  return response.data.category;
};
