import apiClient from "@/services/apiClient";
import type { Coach } from "@/interfaces/coach.interface";

interface CoachesResponse {
  coaches: Coach[];
}

interface SingleCoachResponse {
  coach: Coach;
}

export const getFreeCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get<CoachesResponse>(`/coaches/free`);
  return response.data.coaches;
};

export const getAssignedCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get<CoachesResponse>(`/coaches/assigned`);
  return response.data.coaches;
};

export const getCoachById = async (id: string): Promise<Coach> => {
  const response = await apiClient.get<SingleCoachResponse>(`/coach/${id}`);
  return response.data.coach;
};
