import { useMutation, useQueryClient } from "@tanstack/react-query";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { QUERY_CURRENT_USER_KEY } from "@/constants/query.constant";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      token.removeToken(ACCESS_TOKEN_KEY);
    },

    onSuccess: () => {
      queryClient.setQueryData([QUERY_CURRENT_USER_KEY], null);
    },
  });
};
