import { useQuery } from "@tanstack/react-query";
import { getAssignedCoaches } from "@/services/coach/coachService";

export const ASSIGNED_COACHES_KEY = ["coaches", "assigned"];

export const useAssignedCoachesQuery = () => {
  return useQuery({
    queryKey: ASSIGNED_COACHES_KEY,
    queryFn: getAssignedCoaches,
  });
};
