import apiClient from "@/services/apiClient";
import type { Set } from "@/interfaces/set.interface";

interface SetsResponse {
  sets: Set[];
}

interface SingleSetResponse {
  set: Set;
}

export const getActualSetFromMath = async (slug: string): Promise<Set> => {
  const response = await apiClient.get<SingleSetResponse>("fastapi", `/api/sets/set-match/${slug}`);
  return response.data.set;
};

export const getFinishedSetsByMatch = async (slug: string): Promise<Set[]> => {
  const response = await apiClient.get<SetsResponse>("express", `/sets/finished/${slug}`);
  return response.data.sets;
};
