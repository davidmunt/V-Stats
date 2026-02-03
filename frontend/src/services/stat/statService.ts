import apiClient from "@/services/apiClient";
import type { Stat } from "@/interfaces/stat.interface";

interface StatsResponse {
  actions: Stat[];
  total_actions: number;
  team_id: string;
}

export const getStatsFromTeam = async () => {
  const response = await apiClient.get<StatsResponse>(`/stats/team`);
  return response.data;
};
