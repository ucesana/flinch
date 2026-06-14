import { post } from "./rest.service";

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
  return post("/api/auth/login", loginRequest);
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
