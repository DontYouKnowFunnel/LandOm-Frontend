// // import { getRequest } from "./api";

import { postRequest } from "./api";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginReturnType = {
  accessToken: string;
  refreshToken: string;
};

export const login =
  async (data: LoginPayload) => async (): Promise<LoginReturnType> => {
    const response = await postRequest<LoginReturnType>(
      "/api/v1/auth/login",
      data
    );
    return response;
  };

export type SignUpPayload = {
  username: string;
  password: string;
};

export const signUp =
  async (data: SignUpPayload) => async (): Promise<void> => {
    const response = await postRequest<void>("/api/v1/auth/signup", data);
    return response;
  };

export type RefreshPayload = {
  refreshToken: string;
};

export type RefreshReturnType = {
  accessToken: string;
  refreshToken: string;
};

export const refresh =
  async (data: RefreshPayload) => async (): Promise<RefreshReturnType> => {
    const response = await postRequest<RefreshReturnType>(
      "/api/v1/auth/refresh",
      data
    );
    return response;
  };
