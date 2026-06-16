import { post } from "./rest.service";
import { request } from "~/services/request.service";
import { getDeviceId, HEADER_DEVICE_ID_KEY } from "~/lib/web";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export const login = (loginRequest: LoginRequest): Promise<TokensResponse> => {
  return request("POST", "/api/auth/login", {
    body: loginRequest,
    headers: { [HEADER_DEVICE_ID_KEY]: getDeviceId() },
  });
};

interface RefreshTokenRequest {
  refreshToken?: string;
}

export const refresh = (
  refreshTokenRequest: RefreshTokenRequest = {},
): Promise<TokensResponse> => {
  return post("/api/auth/refresh", { refreshToken: refreshTokenRequest });
};

export const logout = (): Promise<void> => {
  return post("/api/auth/logout", null);
};
