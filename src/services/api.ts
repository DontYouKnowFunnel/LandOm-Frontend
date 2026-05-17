import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

const axiosApiInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_REFRESH_FAILED = "AUTH_REFRESH_FAILED";

export class AuthRefreshError extends Error {
  readonly isAuthRefreshError = true;

  constructor() {
    super(AUTH_REFRESH_FAILED);
    this.name = "AuthRefreshError";
  }
}

const clearAuthSession = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

let refreshPromise: Promise<string> | null = null;

const getRefreshedAccessToken = async (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new AuthRefreshError();
  }

  refreshPromise = axios
    .post<{ accessToken?: string }>(`${baseURL}/api/v1/auth/refresh`, {
      refreshToken,
    })
    .then(({ data }) => {
      if (!data.accessToken) {
        throw new AuthRefreshError();
      }
      sessionStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getRefreshedAccessToken();
        const retryRequestConfig = {
          ...originalRequest,
          headers: {
            ...(originalRequest.headers ?? {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
          // React Query가 넘긴 기존 signal이 이미 abort 상태면 재시도도 즉시 취소됩니다.
          signal: undefined,
          cancelToken: undefined,
        };

        return axiosApiInstance.request(retryRequestConfig);
      } catch {
        clearAuthSession();
        return Promise.reject(new AuthRefreshError());
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
