import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubstitution } from "@/services/substitution/substitutionService";

export const useCreateSubstitutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { slug_lineup: string; slug_player_out: string; slug_player_in: string }) =>
      createSubstitution({
        slug_lineup: params.slug_lineup,
        slug_player_out: params.slug_player_out,
        slug_player_in: params.slug_player_in,
      }),
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
