import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveLineup } from "@/services/lineup/lineupService";
import type { SaveLineupParam } from "@/services/lineup/lineupService.param";

export const useSaveLineupMutation = (matchSlug: string, teamSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveLineupParam) => saveLineup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lineup", matchSlug, teamSlug],
      });
      queryClient.invalidateQueries({ queryKey: ["match", "lineups"] });
    },
  });
};
