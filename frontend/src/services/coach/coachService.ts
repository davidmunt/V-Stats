import apiClient from "@/services/apiClient";
import type { Coach } from "@/interfaces/coach.interface";

interface CoachesResponse {
  coaches: Coach[];
}

interface SingleCoachResponse {
  coach: Coach;
}

export const getFreeCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get<CoachesResponse>("spring", `/api/user/free/coaches`);
  return response.data.coaches;
};

export const getAssignedCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get<CoachesResponse>("spring", `/api/user/assigned/coaches`);
  return response.data.coaches;
};

export const getCoachBySlug = async (slug_coach: string): Promise<Coach> => {
  const response = await apiClient.get<SingleCoachResponse>("express", `/coach/${slug_coach}`);
  return response.data.coach;
};
