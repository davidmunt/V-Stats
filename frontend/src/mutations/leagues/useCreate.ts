import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeague } from "@/services/admin/league/adminLeagueService";
import type { CreateLeagueParam } from "@/services/admin/league/adminLeagueService.param";
import type { League } from "@/interfaces/league.interface";
import { LEAGUES_QUERY_KEY } from "@/queries/leagues/useLeagues";

export const useCreateLeagueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeagueParam) => createLeague(data),
    onSuccess: (newLeague) => {
      // MAGIA AQUÍ: Actualizamos la caché manualmente
      queryClient.setQueryData<League[]>(LEAGUES_QUERY_KEY, (oldLeagues) => {
        // Si no había ligas cargadas, creamos el array con la nueva
        if (!oldLeagues) return [newLeague];

        // Si ya había, devolvemos un NUEVO array con la nueva liga al final
        return [...oldLeagues, newLeague];
      });
    },
  });
};
