import { useQuery } from "@tanstack/react-query";
import { getTeamBySlug } from "@/services/admin/team/adminTeamService";
import type { Team } from "@/interfaces/team.interface";

export const TEAMS_DETAIL_QUERY_KEY = (slug: string) => ["teams", "detail", slug];

export const useTeamBySlugQuery = (slug: string) => {
  return useQuery<Team>({
    queryKey: TEAMS_DETAIL_QUERY_KEY(slug),
    queryFn: () => getTeamBySlug(slug),
    enabled: !!slug,
  });
};
