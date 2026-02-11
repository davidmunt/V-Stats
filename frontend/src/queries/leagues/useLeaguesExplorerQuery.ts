import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getFilteredLeagues } from "@/services/league/adminLeagueService";
import type { GetFilteredLeagueParam } from "@/services/league/adminLeagueService.param";

export const useLeaguesExplorerQuery = () => {
  const url = useUrlState();

  const q = url.get("q", "");
  const category = url.get("category", "");
  const status = url.get("status", "active");
  const sort = url.get("sort", "recent");
  const page = Number(url.get("page", "0"));
  const size = Number(url.get("size", "10"));

  const [qInput, setQInput] = useState(q);
  const debouncedQ = useDebouncedValue(qInput, 400);

  const [apiParams, setApiParams] = useState<GetFilteredLeagueParam>({
    name: q,
    slug_category: category,
    status,
    sort,
    page,
    size,
  });

  useEffect(() => {
    setQInput(q);
  }, [q]);

  useEffect(() => {
    url.setMany({ q: debouncedQ, page: 0 }, { replace: true });
  }, [debouncedQ]);

  useEffect(() => {
    setApiParams({
      name: debouncedQ,
      slug_category: category,
      status,
      sort,
      page,
      size,
    });
  }, [debouncedQ, category, status, sort, page, size]);

  const query = useQuery({
    queryKey: ["leagues", "explorer", apiParams],
    queryFn: () => getFilteredLeagues(apiParams),
    placeholderData: (previousData) => previousData,
  });

  const actions = {
    setSearch: (val: string) => setQInput(val),
    setCategory: (val: string) => url.setMany({ category: val, page: 0 }),
    setStatus: (val: string) => url.setMany({ status: val, page: 0 }),
    setSort: (val: string) => url.setMany({ sort: val, page: 0 }),
    setPage: (p: number) => url.set("page", p),
    setSize: (s: number) => url.setMany({ size: s, page: 0 }),
    clearFilters: () => url.setMany({ q: "", category: "", status: "active", page: 0 }),
  };

  return {
    ...query,
    qInput,
    filters: { q, category, status, sort, page, size },
    actions,
  };
};
