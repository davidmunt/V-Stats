import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/auth/authService";
import type { LoginParam } from "@/services/auth/authService.param";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { CURRENT_USER_QUERY_KEY } from "@/constants/query.constant";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginParam) => login(data),
    onSuccess: (response) => {
      const accessToken = response.data.accessToken;
      token.setToken(ACCESS_TOKEN_KEY, accessToken);
      queryClient.invalidateQueries({
        queryKey: [CURRENT_USER_QUERY_KEY],
      });
    },
  });
};
