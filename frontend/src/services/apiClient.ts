import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

const API_URLS: Record<string, string> = {
  express: import.meta.env.VITE_API_URL,
  spring: import.meta.env.VITE_SPRING_API_URL,
  fastapi: import.meta.env.VITE_FASTAPI_API_URL,
};

const axiosInstance = axios.create({ withCredentials: true });

axiosInstance.interceptors.request.use((config) => {
  const jwtToken = token.getToken(ACCESS_TOKEN_KEY);
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return config;
});

//////////////////

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Si es 401 y no es una petición que ya intentamos refrescar
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya hay un refresh en curso, añadimos esta petición a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Realizamos el refresh call
        const response = await axios.post(
          // Usamos axios directamente para evitar el interceptor aquí
          `${API_URLS.spring}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = response.data.accessToken;
        token.setToken(ACCESS_TOKEN_KEY, newToken);

        // Actualizamos el header de la petición original
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Procesamos la cola con el nuevo token
        processQueue(null, newToken);
        isRefreshing = false;

        // Reintentamos la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, limpiamos todo y redirigimos
        processQueue(refreshError, null);
        isRefreshing = false;
        token.removeToken(ACCESS_TOKEN_KEY);
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

///////////////////

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
