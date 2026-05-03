import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startMatch } from "@/services/match/matchService";
import { MATCH_QUERY_KEY } from "@/queries/match/useMatch";
import { ANALYST_MATCHES_QUERY_KEY } from "@/queries/match/useAnalystMatches";
import { NEXT_MATCH_ANALYST_QUERY_KEY } from "@/queries/match/useNextMatchForAnalyst";

export const useStartMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchSlug: string) => startMatch(matchSlug),
    onSuccess: (_, matchSlug) => {
      queryClient.invalidateQueries({
        queryKey: MATCH_QUERY_KEY(matchSlug),
      });
      queryClient.invalidateQueries({
        queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(),
      });
      queryClient.invalidateQueries({
        queryKey: ANALYST_MATCHES_QUERY_KEY(),
      });
    },
  });
};
