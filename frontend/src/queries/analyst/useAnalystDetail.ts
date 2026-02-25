import { useQuery } from "@tanstack/react-query";
import { getAnalystBySlug } from "@/services/analyst/analystService";

export const ANALYST_DETAIL_KEY = (slug: string) => ["analysts", "detail", slug];

export const useAnalystDetailQuery = (slug: string | null) => {
  return useQuery({
    queryKey: ANALYST_DETAIL_KEY(slug || ""),
    queryFn: () => getAnalystBySlug(slug!),
    enabled: !!slug,
  });
};
