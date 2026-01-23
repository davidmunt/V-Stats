import apiClient from "@/services/apiClient";
import type { Analyst } from "@/interfaces/analyst.interface";

interface AnalystsResponse {
  analysts: Analyst[];
}

interface SingleAnalystResponse {
  analyst: Analyst;
}

export const getFreeAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>(`/analysts/free`);
  return response.data.analysts;
};

export const getAssignedAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>(`/analysts/assigned`);
  return response.data.analysts;
};

export const getAnalystById = async (id: string): Promise<Analyst> => {
  const response = await apiClient.get<SingleAnalystResponse>(`/analyst/${id}`);
  return response.data.analyst;
};
