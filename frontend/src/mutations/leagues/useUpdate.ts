import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeague } from "@/services/league/adminLeagueService";
import type { UpdateLeagueParam } from "@/services/league/adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { LEAGUES_QUERY_KEY } from "@/queries/leagues/useLeagues";
import { LEAGUE_DETAIL_QUERY_KEY } from "@/queries/leagues/useLeagueBySlug";

export const useUpdateLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLeagueParam) => updateLeague(data),
    onSuccess: (updatedLeague) => {
      queryClient.setQueryData<League[]>(LEAGUES_QUERY_KEY, (oldLeagues) => {
        if (!oldLeagues) return [updatedLeague];
        return oldLeagues.map((league) => (league.slug === updatedLeague.slug ? updatedLeague : league));
      });
      queryClient.setQueryData(LEAGUE_DETAIL_QUERY_KEY(updatedLeague.slug), updatedLeague);
    },
  });
};
