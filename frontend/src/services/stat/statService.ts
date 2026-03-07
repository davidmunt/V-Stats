import apiClient from "@/services/apiClient";
import type { Stat } from "@/interfaces/stat.interface";

export interface StatsResponse {
  stats: Stat[];
}

export const getStatsForTeam = async (teamSlug: string, actionType: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/team/${teamSlug}/type/${actionType}`);
  return response.data;
};

export const getStatsAgainstTeam = async (teamSlug: string, actionType: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/team/${teamSlug}/type/${actionType}/against`);
  return response.data;
};
