import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "@/services/auth/authService";
import type { UpdatePasswordParam } from "@/services/auth/authService.param";
import { CURRENT_USER_QUERY_KEY } from "../../queries/auth/useCurrentUser";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

export const useUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePasswordParam) => updatePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });
      token.removeToken(ACCESS_TOKEN_KEY);
      queryClient.clear();
      window.location.href = "/auth";
    },
  });
};
