import { useQuery } from "@tanstack/react-query";
import { getActualSetFromMath } from "@/services/set/setService";
import type { Set } from "@/interfaces/set.interface";

export const SET_DETAIL_QUERY_KEY = (slug: string) => ["set", "detail", slug];

export const useActualSetQuery = (slug: string) => {
  return useQuery<Set>({
    queryKey: SET_DETAIL_QUERY_KEY(slug),
    queryFn: () => getActualSetFromMath(slug),
    enabled: !!slug,
  });
};
