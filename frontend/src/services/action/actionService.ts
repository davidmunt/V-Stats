import apiClient from "@/services/apiClient";
import type { CreateActionParam } from "./actionService.param";
import type { Action } from "@/interfaces/action.interface";

// interface ActionsResponse {
//   actions: Action[];
// }

interface SingleActionResponse {
  action: Action;
}

export const createAction = async ({
  slug,
  id_point_for_team,
  action_type,
  id_player,
  id_team,
  player_position,
  result,
  end_x,
  end_y,
  start_x,
  start_y,
}: CreateActionParam): Promise<Action> => {
  const response = await apiClient.post<SingleActionResponse>(`/set/${slug}/action`, {
    id_point_for_team,
    action_type,
    id_player,
    id_team,
    player_position,
    result,
    end_x,
    end_y,
    start_x,
    start_y,
  });
  return response.data.action;
};

export const cancelLastAction = async (slug: string, teamSlug: string): Promise<void> => {
  await apiClient.delete<void>(`/set/${slug}/${teamSlug}/action`);
};
