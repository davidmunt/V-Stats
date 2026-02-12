import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

const API_URLS: Record<string, string> = {
  express: import.meta.env.VITE_API_URL,
  spring: import.meta.env.VITE_SPRING_API_URL,
  fastapi: import.meta.env.VITE_FASTAPI_API_URL,
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const jwtToken = token.getToken(ACCESS_TOKEN_KEY);
  if (jwtToken) {
    config.headers.Authorization = `Token ${jwtToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        token.removeToken(ACCESS_TOKEN_KEY);
      }
    }
    return Promise.reject(error);
  },
);

const apiClient = {
  get: <T>(provider: string, url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, { ...config, baseURL: API_URLS[provider] }),

  post: <T>(provider: string, url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, { ...config, baseURL: API_URLS[provider] }),

  put: <T>(provider: string, url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, { ...config, baseURL: API_URLS[provider] }),

  patch: <T>(provider: string, url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, { ...config, baseURL: API_URLS[provider] }),

  delete: <T>(provider: string, url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, { ...config, baseURL: API_URLS[provider] }),
};

export default apiClient;
