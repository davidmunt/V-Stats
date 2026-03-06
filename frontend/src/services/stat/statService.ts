import apiClient from "@/services/apiClient";
import type { Stat } from "@/interfaces/stat.interface";

interface StatsResponse {
  actions: Stat[];
  total_actions: number;
  slug_team: string;
}

export const getStatsFromTeam = async (teamSlug: string, actionType: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/team/${teamSlug}/type/${actionType}`);
  return response.data;
};
