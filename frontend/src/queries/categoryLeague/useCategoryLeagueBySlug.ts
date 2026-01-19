import { useQuery } from "@tanstack/react-query";
import { getCategoryLeagueBySlug } from "@/services/admin/categoryLeague/adminCategoryLeagueService";
import type { CategoryLeague } from "@/interfaces/categoryLeague.interface";

export const CATEGORY_LEAGUE_DETAIL_QUERY_KEY = (slug: string) => ["category-leagues", "detail", slug];

export const useCategoryLeagueBySlugQuery = (slug: string) => {
  return useQuery<CategoryLeague>({
    queryKey: CATEGORY_LEAGUE_DETAIL_QUERY_KEY(slug),
    queryFn: () => getCategoryLeagueBySlug(slug),
    enabled: !!slug,
  });
};
