// export const useStartMatchMutation = (analystSlug: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (matchSlug: string) => startMatch(matchSlug),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(analystSlug) });
//     },
//   });
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startMatch } from "@/services/match/matchService";
import { MATCH_QUERY_KEY } from "@/queries/match/useMatch";
import { ANALYST_MATCHES_QUERY_KEY } from "@/queries/match/useAnalystMatches";
import { NEXT_MATCH_ANALYST_QUERY_KEY } from "@/queries/match/useNextMatchForAnalyst";

export const useStartMatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchSlug: string) => startMatch(matchSlug),
    onSuccess: (_, matchSlug) => {
      // 1. Invalidamos el partido específico (Scouting)
      queryClient.invalidateQueries({
        queryKey: MATCH_QUERY_KEY(matchSlug),
      });

      // 2. Invalidamos el "Próximo partido" (Tu equipo - MatchAnalysisManager)
      // Nota: NEXT_MATCH_ANALYST_QUERY_KEY no debería necesitar parámetros
      // si la clave es constante, si los necesita, pásalos aquí.
      queryClient.invalidateQueries({
        queryKey: NEXT_MATCH_ANALYST_QUERY_KEY(),
      });

      // 3. Invalidamos la lista general de la liga
      queryClient.invalidateQueries({
        queryKey: ANALYST_MATCHES_QUERY_KEY(),
      });
    },
  });
};
