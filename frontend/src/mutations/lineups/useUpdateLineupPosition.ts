import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLineupPosition } from "@/services/lineup/lineupService";
import type { UpdateLineupPositionParam } from "@/services/lineup/lineupService.param";
import { COACH_LINEUP_QUERY_KEY } from "@/queries/lineups/useCoachLineup";

export const useUpdateLineupPositionMutation = (matchSlug: string, teamSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLineupPositionParam) => updateLineupPosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COACH_LINEUP_QUERY_KEY(matchSlug, teamSlug),
      });
    },
  });
};
