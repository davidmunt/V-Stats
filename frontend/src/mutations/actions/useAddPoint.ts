import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAction } from "@/services/action/actionService";

export const useAddPointMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      setSlug: string;
      slug_team: string;
      slug_player?: string;
      action_type?: string;
      result?: string;
      player_position?: number;
      slug_point_for_team?: string | null;
      start_x?: number;
      start_y?: number;
      end_x?: number;
      end_y?: number;
    }) =>
      createAction({
        slug_set: params.setSlug,
        slug_team: params.slug_team,
        slug_player: params.slug_player,
        action_type: params.action_type || "POINT_ADJUSTMENT",
        result: params.result,
        player_position: params.player_position,
        slug_point_for_team: params.slug_point_for_team !== undefined ? (params.slug_point_for_team ?? "") : params.slug_team,
        start_x: params.start_x ?? 0,
        start_y: params.start_y ?? 0,
        end_x: params.end_x ?? 0,
        end_y: params.end_y ?? 0,
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
