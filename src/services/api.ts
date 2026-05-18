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
const AUTH_ROUTES = ["/login", "/signup"];

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

export const getCurrentRedirectPath = () => {
  if (typeof window === "undefined") return "/";

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const getLoginPathWithRedirect = (redirectPath: string) => {
  const isAuthRoute = AUTH_ROUTES.some((path) => redirectPath.startsWith(path));
  if (!redirectPath || isAuthRoute) return "/login";

  return `/login?redirect=${encodeURIComponent(redirectPath)}`;
};

export const getSafeRedirectPath = (redirect?: string | null) => {
  if (!redirect) return "/";

  try {
    const redirectUrl = new URL(redirect, window.location.origin);
    const redirectPath = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
    const isInternalUrl = redirectUrl.origin === window.location.origin;
    const isAuthRoute = AUTH_ROUTES.some((path) => redirectPath.startsWith(path));

    if (!isInternalUrl || isAuthRoute) return "/";

    return redirectPath;
  } catch {
    return "/";
  }
};

let isRedirectingToLogin = false;

const redirectToLogin = () => {
  if (typeof window === "undefined" || isRedirectingToLogin) return;

  isRedirectingToLogin = true;
  window.location.replace(getLoginPathWithRedirect(getCurrentRedirectPath()));
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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
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
        redirectToLogin();
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
