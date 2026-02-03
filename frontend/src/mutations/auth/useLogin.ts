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
    onSuccess: async (data) => {
      tokenService.setToken(ACCESS_TOKEN_KEY, data.token);
      await queryClient.resetQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
        exact: true,
      });
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, data);
    },
  });
};
