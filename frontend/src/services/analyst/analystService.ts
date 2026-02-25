import apiClient from "@/services/apiClient";
import type { Analyst } from "@/interfaces/analyst.interface";

interface AnalystsResponse {
  analysts: Analyst[];
}

interface SingleAnalystResponse {
  analyst: Analyst;
}

export const getFreeAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>("spring", `/api/user/free/analysts`);
  return response.data.analysts;
};

export const getAssignedAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>("spring", `/api/user/assigned/analysts`);
  return response.data.analysts;
};

export const getAnalystBySlug = async (slug_analyst: string): Promise<Analyst> => {
  const response = await apiClient.get<SingleAnalystResponse>("express", `/analyst/${slug_analyst}`);
  return response.data.analyst;
};
