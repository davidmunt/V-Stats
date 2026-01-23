import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMatch } from "@/services/match/matchService";
import type { CreateMatchParam } from "@/services/match/matchService.param";
import type { Match } from "@/interfaces/match.interface";
import { MATCHES_LIST_QUERY_KEY } from "@/queries/match/useMatches";

export const useCreateMatchMutation = (leagueSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchParam) => createMatch(data),
    onSuccess: (newMatch) => {
      queryClient.setQueryData<Match[]>(MATCHES_LIST_QUERY_KEY(leagueSlug), (oldMatches) => {
        if (!oldMatches) return [newMatch];
        return [...oldMatches, newMatch];
      });
    },
  });
};
