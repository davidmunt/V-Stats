import { useQuery } from "@tanstack/react-query";
import { getAnalystById } from "@/services/analyst/analystService";

export const ANALYST_DETAIL_KEY = (id: string) => ["analysts", "detail", id];

export const useAnalystDetailQuery = (id: string | null) => {
  return useQuery({
    queryKey: ANALYST_DETAIL_KEY(id || ""),
    queryFn: () => getAnalystById(id!),
    enabled: !!id,
  });
};
