import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/repositories/auth/authRepository";
import type { UpdateUserParam } from "@/repositories/auth/authRepository.param";
import { CURRENT_USER_QUERY_KEY } from "../queries/useCurrentUser";

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
