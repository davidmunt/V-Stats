import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryLeague } from "@/services/categoryLeague/adminCategoryLeagueService";
import type { CreateCategoryLeagueParam } from "@/services/categoryLeague/adminCategoryLeagueService.param";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";
import { CATEGORY_LEAGUES_QUERY_KEY } from "@/queries/categoryLeagues/useCategoryLeagues";

export const useCreateCategoryLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryLeagueParam) => createCategoryLeague(data),
    onSuccess: (newCategoryLeague) => {
      queryClient.setQueryData<CategoryLeague[]>(CATEGORY_LEAGUES_QUERY_KEY, (oldCategoryLeagues) => {
        if (!oldCategoryLeagues) return [newCategoryLeague];
        return [...oldCategoryLeagues, newCategoryLeague];
      });
    },
  });
};
