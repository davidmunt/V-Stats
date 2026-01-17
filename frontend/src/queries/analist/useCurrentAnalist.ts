import { useQuery } from "@tanstack/react-query";
import { getAllAnalisis } from "@/services/analist/analistService";
import type { User } from "@/interfaces/user.interface";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const useCurrentUserQuery = () => {
  return useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const response = await getAllAnalisis();
      return response.data;
    },
    retry: false,
  });
};
