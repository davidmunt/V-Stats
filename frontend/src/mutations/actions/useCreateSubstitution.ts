import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubstitution } from "@/services/substitution/substitutionService";

export const useCreateSubstitutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id_lineup: string; id_player_out: string; id_player_in: string }) =>
      createSubstitution({
        id_lineup: params.id_lineup,
        id_player_out: params.id_player_out,
        id_player_in: params.id_player_in,
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
