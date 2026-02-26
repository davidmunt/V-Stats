import apiClient from "@/services/apiClient";
import type { CreateSubstitutionParam } from "./substitutionService.param";

export const createSubstitution = async ({ slug_lineup, slug_player_out, slug_player_in }: CreateSubstitutionParam) => {
  await apiClient.post<unknown>("fastapi", `/api/actions/substitute`, {
    slug_lineup,
    slug_player_out,
    slug_player_in,
  });
};
