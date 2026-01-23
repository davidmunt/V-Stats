import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMatch } from "@/services/match/matchService";
import { MATCHES_LIST_QUERY_KEY } from "@/queries/match/useMatches";

export const useDeleteMatchMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, matchSlug }: { slug: string; matchSlug: string }) => deleteMatch({ slug, matchSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MATCHES_LIST_QUERY_KEY(leagueSlug),
      });
    },
  });
};
