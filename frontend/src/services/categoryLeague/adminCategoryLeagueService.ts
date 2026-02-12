import apiClient from "@/services/apiClient";
import type { CreateCategoryLeagueParam, DeleteCategoryLeagueParam, UpdateCategoryLeagueParam } from "./adminCategoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

interface CategoriesResponse {
  categories: CategoryLeague[];
}

interface SingleCategoryResponse {
  category: CategoryLeague;
}

export const createCategoryLeague = async ({ name, description, image }: CreateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.post<SingleCategoryResponse>("express", "/categories", {
    name,
    description,
    image,
  });
  return response.data.category;
};

export const updateCategoryLeague = async ({
  slug,
  name,
  description,
  image,
  status,
  is_active,
}: UpdateCategoryLeagueParam): Promise<CategoryLeague> => {
  const response = await apiClient.put<SingleCategoryResponse>("express", `/categories/${slug}`, {
    name,
    description,
    image,
    status,
    is_active,
  });
  return response.data.category;
};

export const deleteCategoryLeague = async ({ slug }: DeleteCategoryLeagueParam): Promise<void> => {
  await apiClient.delete<void>("express", `/categories/${slug}`);
};

export const getMyCategoryLeagues = async (): Promise<CategoryLeague[]> => {
  const response = await apiClient.get<CategoriesResponse>("express", "/categories/my-categories");
  return response.data.categories;
};

export const getCategoryLeagueBySlug = async (slug: string): Promise<CategoryLeague> => {
  const response = await apiClient.get<SingleCategoryResponse>("express", `/categories/${slug}`);
  return response.data.category;
};
