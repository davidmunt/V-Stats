import apiClient from "@/services/apiClient";
import type { CreateCategoryLeagueParam, DeleteCategoryLeagueParam, UpdateCategoryLeagueParam } from "./adminCategoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

// 1. Respuesta para LISTAS (Get All)
interface CategoriesResponse {
  categories: CategoryLeague[];
}

// 2. Respuesta para ITEMS INDIVIDUALES (Get One, Create, Update)
// Asumo que tu backend devuelve { "category": {...} } cuando pides una sola.
interface SingleCategoryResponse {
  category: CategoryLeague;
}

export const createCategoryLeague = async ({ name, description, image }: CreateCategoryLeagueParam): Promise<CategoryLeague> => {
  // Usamos SingleCategoryResponse
  const response = await apiClient.post<SingleCategoryResponse>("/categories", {
    name,
    description,
    image,
  });
  return response.data.category; // Devolvemos la categoría creada
};

export const updateCategoryLeague = async ({
  slug,
  name,
  description,
  image,
  status,
  isActive,
}: UpdateCategoryLeagueParam): Promise<CategoryLeague> => {
  // Usamos SingleCategoryResponse
  const response = await apiClient.put<SingleCategoryResponse>(`/categories/${slug}`, {
    name,
    description,
    image,
    status,
    isActive,
  });
  return response.data.category;
};

export const deleteCategoryLeague = async ({ slug }: DeleteCategoryLeagueParam): Promise<void> => {
  await apiClient.delete<void>(`/categories/${slug}`);
};

export const getMyCategoryLeagues = async (): Promise<CategoryLeague[]> => {
  // CORREGIDO: Quitamos los corchetes [] del generic. Recibimos UN objeto respuesta.
  const response = await apiClient.get<CategoriesResponse>("/categories/my-categories");
  return response.data.categories;
};

export const getCategoryLeagueBySlug = async (slug: string): Promise<CategoryLeague> => {
  // CORREGIDO: Usamos la interfaz de respuesta individual
  const response = await apiClient.get<SingleCategoryResponse>(`/categories/${slug}`);
  return response.data.category;
};
