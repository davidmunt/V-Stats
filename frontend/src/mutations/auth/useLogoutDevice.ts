import { useMutation, useQueryClient } from "@tanstack/react-query";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { logoutDevice } from "@/services/auth/authService";

export const useLogoutDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutDevice,
    onSuccess: () => {
      token.removeToken(ACCESS_TOKEN_KEY);
      queryClient.clear();
      window.location.href = "/auth";
    },
    onError: () => {
      token.removeToken(ACCESS_TOKEN_KEY);
      window.location.href = "/auth";
    },
  });
};
