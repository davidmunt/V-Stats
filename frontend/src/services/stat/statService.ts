import apiClient from "@/services/apiClient";
import type { Stat } from "@/interfaces/stat.interface";

interface StatsResponse {
  actions: Stat[];
  total_actions: number;
  team_id: string;
}

export const getStatsFromTeam = async () => {
  const response = await apiClient.get<StatsResponse>("express", `/stats/team`);
  return response.data;
};
