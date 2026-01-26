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
      tokenService.setToken(ACCESS_TOKEN_KEY, data.token);
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });
    },
  });
};
