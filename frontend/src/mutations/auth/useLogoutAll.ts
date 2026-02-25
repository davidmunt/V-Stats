import { useMutation, useQueryClient } from "@tanstack/react-query";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { logoutAll } from "@/services/auth/authService";

export const useLogoutAllMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      token.removeToken(ACCESS_TOKEN_KEY);
      return await logoutAll();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/auth";
    },
  });
};
