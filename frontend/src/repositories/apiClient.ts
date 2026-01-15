import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const logOnDev = (message: string, log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError) => {
  if (import.meta.env.DEV) {
    console.log(message, log);
  }
};

// REQUEST
apiClient.interceptors.request.use((request) => {
  const jwtToken = token.getToken(ACCESS_TOKEN_KEY);
  if (jwtToken) {
    request.headers.Authorization = `Bearer ${jwtToken}`;
  }
  logOnDev(`🚀 [${request.method?.toUpperCase()}] ${request.url} | Request`, request);
  return request;
});

// RESPONSE
apiClient.interceptors.response.use(
  (response) => {
    logOnDev(`✨ [${response.config.method?.toUpperCase()}] ${response.config.url} | Response ${response.status}`, response);
    return response;
  },
  (error: AxiosError) => {
    // Network / CORS error
    if (!error.response) {
      logOnDev("🚨 Network Error", error);
      return Promise.reject(error);
    }
    const { status } = error.response;
    if (status === 401 || status === 403) {
      token.removeToken(ACCESS_TOKEN_KEY);
    }
    logOnDev(`🚨 [${error.config?.method?.toUpperCase()}] ${error.config?.url} | Error ${status}`, error);
    return Promise.reject(error);
  }
);

export default apiClient;
