import apiClient from "@/services/apiClient";
import type { Stat } from "@/interfaces/stat.interface";
import type { StatGeneral } from "@/interfaces/statGeneral.interface";

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

export const getStatsForPlayer = async (playerSlug: string, actionType: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/player/${playerSlug}/type/${actionType}`);
  return response.data;
};

export const getStatsAgainstPlayer = async (playerSlug: string, actionType: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/player/${playerSlug}/type/${actionType}/against`);
  return response.data;
};

export const getGeneralStatsForTeam = async (teamSlug: string) => {
  const response = await apiClient.get<StatGeneral>("fastapi", `/api/stats/team/${teamSlug}/general`);
  return response.data;
};
