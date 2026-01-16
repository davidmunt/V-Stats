import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/auth/authService";
import type { UpdateUserParam } from "@/services/auth/authService.param";
import { CURRENT_USER_QUERY_KEY } from "../../queries/auth/useCurrentUser";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserParam) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURRENT_USER_QUERY_KEY,
      });
    },
  });
};
