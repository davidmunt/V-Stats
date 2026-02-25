import { useQuery } from "@tanstack/react-query";
import { getCoachBySlug } from "@/services/coach/coachService";

export const COACH_DETAIL_KEY = (slug: string) => ["coaches", "detail", slug];

export const useCoachByIdQuery = (slug: string | null) => {
  return useQuery({
    queryKey: COACH_DETAIL_KEY(slug || ""),
    queryFn: () => getCoachBySlug(slug!),
    enabled: !!slug,
  });
};
