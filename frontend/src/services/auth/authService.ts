import apiClient from "@/services/apiClient";
import type { LoginParam, RegisterParam, UpdateUserParam } from "./authService.param";

export const login = async ({ email, password }: LoginParam) => {
  return apiClient({
    method: "post",
    url: "/auth/login",
    data: {
      email,
      password,
    },
  });
};

export const register = async ({ name, email, password, user_type }: RegisterParam) => {
  return apiClient({
    method: "post",
    url: "/auth/register",
    data: {
      name,
      email,
      password,
      user_type,
    },
  });
};

export const getCurrentUser = async () => {
  return apiClient({
    method: "get",
    url: "/auth/me",
  });
};

export const updateUser = async (data: UpdateUserParam) => {
  return apiClient({
    method: "put",
    url: "/auth/me",
    data,
  });
};
