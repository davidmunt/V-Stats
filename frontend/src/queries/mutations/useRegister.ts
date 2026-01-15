import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/repositories/auth/authRepository";
import type { RegisterParam } from "@/repositories/auth/authRepository.param";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { QUERY_CURRENT_USER_KEY } from "@/constants/query.constant";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterParam) => register(data),

    onSuccess: (response) => {
      const accessToken = response.data.accessToken;

      token.setToken(ACCESS_TOKEN_KEY, accessToken);

      queryClient.invalidateQueries({
        queryKey: [QUERY_CURRENT_USER_KEY],
      });
    },
  });
};
