import { useQuery } from "@tanstack/react-query";
import { getFinishedSetsByMatch } from "@/services/set/setService";
import type { Set } from "@/interfaces/set.interface";

export const SET_DETAIL_QUERY_KEY = (slug: string) => ["sets", "match", slug];

export const useFinishedSetsQuery = (slug: string) => {
  return useQuery<Set[]>({
    queryKey: SET_DETAIL_QUERY_KEY(slug),
    queryFn: () => getFinishedSetsByMatch(slug),
    enabled: !!slug,
  });
};
