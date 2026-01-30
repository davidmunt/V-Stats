import { useQuery } from "@tanstack/react-query";
import { getFreeAnalysts } from "@/services/analyst/analystService";

export const FREE_ANALYSTS_KEY = ["analysts", "free"];

export const useFreeAnalystsQuery = () => {
  return useQuery({
    queryKey: FREE_ANALYSTS_KEY,
    queryFn: getFreeAnalysts,
  });
};
