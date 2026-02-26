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
  slug_set,
  slug_point_for_team,
  action_type,
  slug_player,
  slug_team, // <--- Asegúrate de recibirlo aquí
  player_position,
  result,
  end_x,
  end_y,
  start_x,
  start_y,
}: CreateActionParam): Promise<Action> => {
  const response = await apiClient.post<SingleActionResponse>("fastapi", `/api/actions/set/${slug_set}`, {
    slug_point_for_team, // <--- Se envía ahora
    slug_team, // <--- ¡ESTE ES EL QUE TE FALTABA!
    action_type,
    slug_player,
    player_position,
    result,
    end_x,
    end_y,
    start_x,
    start_y,
  });
  return response.data.action;
};

// export const createAction = async ({
//   slug_set,
//   slug_point_for_team,
//   action_type,
//   slug_player,
//   slug_team,
//   player_position,
//   result,
//   end_x,
//   end_y,
//   start_x,
//   start_y,
// }: CreateActionParam): Promise<Action> => {
//   const response = await apiClient.post<SingleActionResponse>("fastapi", `/api/actions/set/${slug_set}`, {
//     slug_point_for_team,
//     action_type,
//     slug_player,
//     slug_team,
//     player_position,
//     result,
//     end_x,
//     end_y,
//     start_x,
//     start_y,
//   });
//   return response.data.action;
// };

export const cancelLastAction = async (slug_set: string, team_slug: string): Promise<void> => {
  await apiClient.delete<void>("express", `/api/actions/set${slug_set}/${team_slug}`);
};
