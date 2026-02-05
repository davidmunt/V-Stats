import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelLastAction } from "@/services/action/actionService";

export const useDeleteLastPointMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setSlug, teamSlug }: { setSlug: string; teamSlug: string }) => cancelLastAction(setSlug, teamSlug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["set", "detail"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["match", "teams"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["match", "lineups"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["sets", "match"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["matches", "next", "analyst"],
        exact: false,
      });
    },
  });
};
