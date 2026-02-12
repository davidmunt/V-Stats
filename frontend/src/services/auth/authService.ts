import apiClient from "@/services/apiClient";
import type { LoginParam, RegisterParam, UpdateUserParam } from "./authService.param";
import type { Auth } from "@/interfaces/auth.interface";
import type { User } from "@/interfaces/user.interface";

export const login = async ({ email, password }: LoginParam): Promise<Auth> => {
  const response = await apiClient.post<Auth>("express", "/auth/login", { email, password });
  return response.data;
};

export const register = async ({ name, email, password, user_type }: RegisterParam): Promise<Auth> => {
  const response = await apiClient.post<Auth>("express", "/auth/register", {
    name,
    email,
    password,
    user_type,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("express", "/auth/me");
  return response.data;
};

export const updateUser = async (data: UpdateUserParam): Promise<User> => {
  const response = await apiClient.put<User>("express", "/auth/me", data);
  return response.data;
};
