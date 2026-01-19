import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth/authService";
import type { User } from "@/interfaces/user.interface";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const useCurrentUserQuery = (options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">) => {
  return useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    ...options,
  });
};
