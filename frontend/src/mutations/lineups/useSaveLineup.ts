import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveLineup } from "@/services/lineup/lineupService";
import type { SaveLineupParam } from "@/services/lineup/lineupService.param";
import { COACH_LINEUP_QUERY_KEY } from "@/queries/lineups/useCoachLineup";

export const useSaveLineupMutation = (matchSlug: string, teamSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveLineupParam) => saveLineup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COACH_LINEUP_QUERY_KEY(matchSlug, teamSlug),
      });
    },
  });
};
