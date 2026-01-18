import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/auth/authService";
import type { LoginParam } from "@/services/auth/authService.param";
import tokenService from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { CURRENT_USER_QUERY_KEY } from "@/queries/auth/useCurrentUser";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginParam) => login(data),
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
