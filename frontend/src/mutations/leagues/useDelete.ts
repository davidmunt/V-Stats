import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLeague } from "@/services/league/adminLeagueService";
import type { DeleteLeagueParam } from "@/services/league/adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { LEAGUES_QUERY_KEY } from "@/queries/leagues/useLeagues";
import { LEAGUE_DETAIL_QUERY_KEY } from "@/queries/leagues/useLeagueBySlug";

export const useDeleteLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteLeagueParam) => deleteLeague(data),
    onSuccess: (_, variables) => {
      // 'variables' contiene los datos que enviamos para borrar (el slug)

      // 1. Actualizar la LISTA: Quitamos la liga que tenga ese slug
      queryClient.setQueryData<League[]>(LEAGUES_QUERY_KEY, (oldLeagues) => {
        if (!oldLeagues) return [];
        return oldLeagues.filter((league) => league.slug !== variables.slug);
      });

      // 2. Eliminar la caché del DETALLE específico (limpieza)
      queryClient.removeQueries({
        queryKey: LEAGUE_DETAIL_QUERY_KEY(variables.slug),
      });
    },
  });
};
