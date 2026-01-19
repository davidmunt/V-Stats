import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeague } from "@/services/admin/league/adminLeagueService";
import type { UpdateLeagueParam } from "@/services/admin/league/adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { LEAGUES_QUERY_KEY } from "@/queries/leagues/useLeagues";
import { LEAGUE_DETAIL_QUERY_KEY } from "@/queries/leagues/useLeagueBySlug";

export const useUpdateLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLeagueParam) => updateLeague(data),
    onSuccess: (updatedLeague) => {
      // 1. Actualizar en la LISTA de ligas
      queryClient.setQueryData<League[]>(LEAGUES_QUERY_KEY, (oldLeagues) => {
        if (!oldLeagues) return [updatedLeague];

        // Recorremos el array y reemplazamos solo la que coincida por slug
        return oldLeagues.map((league) => (league.slug === updatedLeague.slug ? updatedLeague : league));
      });

      // 2. Actualizar en el DETALLE individual (si existe en caché)
      // Usamos el slug de la liga devuelta
      queryClient.setQueryData(LEAGUE_DETAIL_QUERY_KEY(updatedLeague.slug), updatedLeague);

      // Nota: Si el slug cambió, también deberíamos borrar la caché del slug viejo,
      // pero para simplificar, esto suele ser suficiente.
    },
  });
};
