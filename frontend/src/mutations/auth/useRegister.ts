import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/services/auth/authService";
import type { RegisterParam } from "@/services/auth/authService.param";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { CURRENT_USER_QUERY_KEY } from "@/queries/auth/useCurrentUser";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterParam) => register(data),
    onSuccess: (data) => {
      // 1. Guardamos el token (data.token es lo que devuelve tu backend)
      tokenService.setToken(ACCESS_TOKEN_KEY, data.token);

      // 2. Invalidamos para que useCurrentUser haga fetch con el nuevo token
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });
    },
  });
};
