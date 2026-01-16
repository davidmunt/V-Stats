import { useMutation, useQueryClient } from "@tanstack/react-query";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";
import { CURRENT_USER_QUERY_KEY } from "@/constants/query.constant";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      token.removeToken(ACCESS_TOKEN_KEY);
    },

    onSuccess: () => {
      queryClient.setQueryData([CURRENT_USER_QUERY_KEY], null);
    },
  });
};
