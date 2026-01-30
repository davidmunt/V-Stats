import { useQuery } from "@tanstack/react-query";
import { getFreeCoaches } from "@/services/coach/coachService";

export const FREE_COACHES_KEY = ["coaches", "free"];

export const useFreeCoachesQuery = () => {
  return useQuery({
    queryKey: FREE_COACHES_KEY,
    queryFn: getFreeCoaches,
  });
};
