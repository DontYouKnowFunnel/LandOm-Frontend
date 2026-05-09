import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

const axiosApiInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = sessionStorage.getItem("accessToken");
    const projectKey = sessionStorage.getItem("projectKey");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    if (projectKey) config.headers["X-Project-Key"] = projectKey;
    return config;
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = sessionStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${baseURL}/api/v1/auth/refresh`, {
            refreshToken,
          });
          sessionStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosApiInstance(originalRequest);
        } catch {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
        }
      } else {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

export const mutationInstance = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosApiInstance(config);
  return response.data;
};
