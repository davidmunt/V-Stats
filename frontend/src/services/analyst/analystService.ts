import apiClient from "@/services/apiClient";
import type { Analyst } from "@/interfaces/analyst.interface";

interface AnalystsResponse {
  analysts: Analyst[];
}

interface SingleAnalystResponse {
  analyst: Analyst;
}

export const getFreeAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>("express", `/analysts/free`);
  return response.data.analysts;
};

export const getAssignedAnalysts = async (): Promise<Analyst[]> => {
  const response = await apiClient.get<AnalystsResponse>("express", `/analysts/assigned`);
  return response.data.analysts;
};

export const getAnalystById = async (id: string): Promise<Analyst> => {
  const response = await apiClient.get<SingleAnalystResponse>("express", `/analyst/${id}`);
  return response.data.analyst;
};
