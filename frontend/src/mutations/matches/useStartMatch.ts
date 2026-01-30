import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startMatch } from "@/services/match/matchService";
import { NEXT_MATCH_ANALYST_QUERY_KEY } from "@/queries/match/useNextMatchForAnalyst";

export const useStartMatchMutation = (analystSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchSlug: string) => startMatch(matchSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(analystSlug) });
    },
  });
};
