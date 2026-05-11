import apiClient from "@/services/apiClient";
import type { Stat, chartStat } from "@/interfaces/stat.interface";
import type { StatGeneral } from "@/interfaces/statGeneral.interface";

export interface StatsResponse {
  stats: Stat[];
}

export interface ChartStatsResponse {
  stats: chartStat;
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

export const getStatsForTeamMatch = async (teamSlug: string, actionType: string, matchSlug: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/team/${teamSlug}/type/${actionType}/match/${matchSlug}`);
  return response.data;
};

export const getStatsAgainstTeamMatch = async (teamSlug: string, actionType: string, matchSlug: string) => {
  const response = await apiClient.get<StatsResponse>(
    "fastapi",
    `/api/stats/team/${teamSlug}/type/${actionType}/match/${matchSlug}/against`,
  );
  return response.data;
};

export const getStatsForPlayerTeamMatch = async (playerSlug: string, actionType: string, matchSlug: string) => {
  const response = await apiClient.get<StatsResponse>("fastapi", `/api/stats/player/${playerSlug}/type/${actionType}/match/${matchSlug}`);
  return response.data;
};

export const getStatsAgainstPlayerTeamMatch = async (playerSlug: string, actionType: string, matchSlug: string) => {
  const response = await apiClient.get<StatsResponse>(
    "fastapi",
    `/api/stats/player/${playerSlug}/type/${actionType}/match/${matchSlug}/against`,
  );
  return response.data;
};

export const getChartStatsForTeam = async (teamSlug: string) => {
  const response = await apiClient.get<ChartStatsResponse>("fastapi", `/api/stats/team/${teamSlug}/chart`);
  return response.data;
};

export const getChartStatsForPlayer = async (playerSlug: string) => {
  const response = await apiClient.get<ChartStatsResponse>("fastapi", `/api/stats/player/${playerSlug}/chart`);
  return response.data;
};

export const getChartStatsForTeamMatch = async (teamSlug: string, matchSlug: string) => {
  const response = await apiClient.get<ChartStatsResponse>("fastapi", `/api/stats/team/${teamSlug}/match/${matchSlug}/chart`);
  return response.data;
};

export const getChartStatsForPlayerMatch = async (playerSlug: string, matchSlug: string) => {
  const response = await apiClient.get<ChartStatsResponse>("fastapi", `/api/stats/player/${playerSlug}/match/${matchSlug}/chart`);
  return response.data;
};
