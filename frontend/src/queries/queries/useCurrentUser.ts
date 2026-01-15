import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/repositories/auth/authRepository";
import type { User } from "@/interfaces/user.interface";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const useCurrentUserQuery = () => {
  return useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
    retry: false,
  });
};
