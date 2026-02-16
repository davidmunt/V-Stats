import { useQuery } from "@tanstack/react-query";
import { getMyCategoryLeagues } from "@/services/category/categoryLeagueService";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

export const CATEGORY_LEAGUES_QUERY_KEY = ["category-leagues"];

export const useCategoryLeaguesQuery = () => {
  return useQuery<CategoryLeague[]>({
    queryKey: CATEGORY_LEAGUES_QUERY_KEY,
    queryFn: getMyCategoryLeagues,
  });
};
