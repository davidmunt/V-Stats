import { useMutation, useQueryClient } from "@tanstack/react-query";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      token.removeToken(ACCESS_TOKEN_KEY);
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/auth";
    },
  });
};
