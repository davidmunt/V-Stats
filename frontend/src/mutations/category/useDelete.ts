import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryLeague } from "@/services/category/categoryLeagueService";
import type { DeleteCategoryLeagueParam } from "@/services/category/categoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { CATEGORY_LEAGUES_QUERY_KEY } from "@/queries/category/useCategories";

export const useDeleteCategoryLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCategoryLeagueParam) => deleteCategoryLeague(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<CategoryLeague[]>(CATEGORY_LEAGUES_QUERY_KEY, (oldCategoryLeagues) => {
        if (!oldCategoryLeagues) return [];
        return oldCategoryLeagues.filter((categoryLeague) => categoryLeague.slug_category !== variables.slug_category);
      });
    },
  });
};
