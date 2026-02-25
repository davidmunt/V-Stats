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
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return config;
});

let isRefreshing = false;
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }
    const { status } = error.response;
    if (status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        const response = await axiosInstance.post(
          `${API_URLS.spring}/api/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        const newToken = response.data.accessToken;
        token.setToken(ACCESS_TOKEN_KEY, newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        token.removeToken(ACCESS_TOKEN_KEY);
        window.location.href = "/auth";
        return Promise.reject(refreshError);
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
