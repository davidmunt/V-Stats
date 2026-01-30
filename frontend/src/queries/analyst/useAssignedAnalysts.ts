import { useQuery } from "@tanstack/react-query";
import { getAssignedAnalysts } from "@/services/analyst/analystService";

export const ASSIGNED_ANALYSTS_KEY = ["analysts", "assigned"];

export const useAssignedAnalystsQuery = () => {
  return useQuery({
    queryKey: ASSIGNED_ANALYSTS_KEY,
    queryFn: getAssignedAnalysts,
  });
};
