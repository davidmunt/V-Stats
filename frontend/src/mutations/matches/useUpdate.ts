import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMatch } from "@/services/match/matchService";
import type { UpdateMatchParam } from "@/services/match/matchService.param";
import type { Match } from "@/interfaces/match.interface";
import { MATCHES_LIST_QUERY_KEY } from "@/queries/match/useMatches";

export const useUpdateMatchMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMatchParam) => updateMatch(data),
    onSuccess: (updatedMatch) => {
      queryClient.setQueryData<Match[]>(MATCHES_LIST_QUERY_KEY(leagueSlug), (oldMatches) => {
        return oldMatches?.map((m) => (m.slug_match === updatedMatch.slug_match ? updatedMatch : m));
      });
    },
  });
};
