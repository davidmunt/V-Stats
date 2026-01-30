import { useQuery } from "@tanstack/react-query";
import { getCoachById } from "@/services/coach/coachService";

export const COACH_DETAIL_KEY = (id: string) => ["coaches", "detail", id];

export const useCoachByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: COACH_DETAIL_KEY(id || ""),
    queryFn: () => getCoachById(id!),
    enabled: !!id,
  });
};
