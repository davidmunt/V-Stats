import { useQuery } from "@tanstack/react-query";
import { getMyLeagues } from "@/services/league/adminLeagueService";
import type { League } from "@/interfaces/league.interface";

export const LEAGUES_QUERY_KEY = ["leagues"];

export const useLeaguesQuery = () => {
  return useQuery<League[]>({
    queryKey: LEAGUES_QUERY_KEY,
    queryFn: getMyLeagues,
  });
};
