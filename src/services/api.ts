import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";

const axiosApiInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const successHandler = <T>(response: AxiosResponse<T>) => {
  return response.data;
};

axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = sessionStorage.getItem("token");
    const projectKey = sessionStorage.getItem("projectKey");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (projectKey) config.headers["X-Project-Key"] = projectKey;
    return config;
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export const getRequest = async <T>(url: string, params?: any) => {
  return axiosApiInstance.get<T>(url, { params }).then(successHandler);
};

export const postRequest = async <T>(url: string, payload: any, options?: any) => {
  return axiosApiInstance.post<T>(url, payload, options).then(successHandler);
};

export const putRequest = async <T>(url: string, payload: any, options?: any) => {
  return axiosApiInstance.put<T>(url, payload, options).then(successHandler);
};

export const patchRequest = async <T>(url: string, payload: any, options?: any) => {
  return axiosApiInstance.patch<T>(url, payload, options).then(successHandler);
};

export const deleteRequest = async <T>(url: string, params?: any) => {
  return axiosApiInstance.delete<T>(url, { params }).then(successHandler);
};
