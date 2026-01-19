import { useQuery } from "@tanstack/react-query";
import { getMyLeagues } from "@/services/admin/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

// Query Key constante para poder invalidarla desde mutaciones después
export const LEAGUES_QUERY_KEY = ["leagues"];

export const useLeaguesQuery = () => {
  return useQuery<League[]>({
    queryKey: LEAGUES_QUERY_KEY,
    queryFn: getMyLeagues,
    // Opcional: staleTime controla cuánto tiempo se consideran "frescos" los datos
    staleTime: 1000 * 60 * 5, // 5 minutos sin refrescar
  });
};
