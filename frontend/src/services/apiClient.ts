import axios, { AxiosError } from "axios";
import token from "@/lib/token";
import { ACCESS_TOKEN_KEY } from "@/constants/token.constant";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//peticion
apiClient.interceptors.request.use((request) => {
  const jwtToken = token.getToken(ACCESS_TOKEN_KEY);
  if (jwtToken) {
    request.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return request;
});

//respuesta
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const { status } = error.response;
    if (status === 401 || status === 403) {
      token.removeToken(ACCESS_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
