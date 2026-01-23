import { useQuery } from "@tanstack/react-query";
import { getFreeAnalysts, getAnalystById, getAssignedAnalysts } from "@/services/analyst/analystService";

export const ANALYST_KEYS = {
  all: ["analysts"] as const,
  free: () => [...ANALYST_KEYS.all, "free"] as const,
  assigned: () => [...ANALYST_KEYS.all, "assigned"] as const,
  detail: (id: string) => [...ANALYST_KEYS.all, "detail", id] as const,
};

export const useFreeAnalystsQuery = () => {
  return useQuery({
    queryKey: ANALYST_KEYS.free(),
    queryFn: getFreeAnalysts,
  });
};

export const useAssignedAnalystsQuery = () => {
  return useQuery({
    queryKey: ANALYST_KEYS.assigned(),
    queryFn: getAssignedAnalysts,
  });
};

export const useAnalystByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: ANALYST_KEYS.detail(id || ""),
    queryFn: () => getAnalystById(id!),
    enabled: !!id,
  });
};
