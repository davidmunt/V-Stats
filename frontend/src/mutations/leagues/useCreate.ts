import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeague } from "@/services/league/adminLeagueService";
import type { CreateLeagueParam } from "@/services/league/adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { LEAGUES_QUERY_KEY } from "@/queries/leagues/useLeagues";

export const useCreateLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeagueParam) => createLeague(data),
    onSuccess: (newLeague) => {
      queryClient.setQueryData<League[]>(LEAGUES_QUERY_KEY, (oldLeagues) => {
        if (!oldLeagues) return [newLeague];
        return [...oldLeagues, newLeague];
      });
    },
  });
};
