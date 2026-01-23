import { useQuery } from "@tanstack/react-query";
import { getFreeCoaches, getCoachById, getAssignedCoaches } from "@/services/coach/coachService";

export const COACH_KEYS = {
  all: ["coaches"] as const,
  free: () => [...COACH_KEYS.all, "free"] as const,
  assigned: () => [...COACH_KEYS.all, "assigned"] as const,
  detail: (id: string) => [...COACH_KEYS.all, "detail", id] as const,
};

export const useFreeCoachesQuery = () => {
  return useQuery({
    queryKey: COACH_KEYS.free(),
    queryFn: getFreeCoaches,
  });
};

export const useAssignedCoachesQuery = () => {
  return useQuery({
    queryKey: COACH_KEYS.assigned(),
    queryFn: getAssignedCoaches,
  });
};

export const useCoachByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: COACH_KEYS.detail(id || ""),
    queryFn: () => getCoachById(id!),
    enabled: !!id,
  });
};
