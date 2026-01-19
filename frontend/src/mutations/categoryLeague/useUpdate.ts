import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryLeague } from "@/services/admin/categoryLeague/adminCategoryLeagueService";
import type { UpdateCategoryLeagueParam } from "@/services/admin/categoryLeague/adminCategoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { CATEGORY_LEAGUES_QUERY_KEY } from "@/queries/categoryLeague/useCategoryLeagues";

export const useUpdateCategoryLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryLeagueParam) => updateCategoryLeague(data),
    onSuccess: (updatedCategoryLeague) => {
      queryClient.setQueryData<CategoryLeague[]>(CATEGORY_LEAGUES_QUERY_KEY, (oldCategoryLeagues) => {
        if (!oldCategoryLeagues) return [updatedCategoryLeague];
        return oldCategoryLeagues.map((categoryLeague) =>
          categoryLeague.slug === updatedCategoryLeague.slug ? updatedCategoryLeague : categoryLeague,
        );
      });
    },
  });
};
