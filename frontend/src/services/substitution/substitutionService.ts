import apiClient from "@/services/apiClient";
import type { CreateSubstitutionParam } from "./substitutionService.param";

export const createSubstitution = async ({ id_lineup, id_player_out, id_player_in }: CreateSubstitutionParam) => {
  await apiClient.post<unknown>("express", `/lineup/substitute`, {
    id_lineup,
    id_player_out,
    id_player_in,
  });
};
