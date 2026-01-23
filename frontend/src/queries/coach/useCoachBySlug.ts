// import { useQuery } from "@tanstack/react-query";
// import { getCoachBySlug } from "@/services/coach/coachService";
// import type { Coach } from "@/interfaces/coach.interface";

// export const COACH_DETAIL_QUERY_KEY = (slug: string) => ["coach", "detail", slug];

// export const useCoachLeagueBySlugQuery = (slug: string) => {
//   return useQuery<Coach>({
//     queryKey: COACH_DETAIL_QUERY_KEY(slug),
//     queryFn: () => getCoach(slug),
//     enabled: !!slug,
//   });
// };
