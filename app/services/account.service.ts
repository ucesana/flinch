import { post, get } from "./rest.service";

export interface RegistrationRequest {
  email: string;
  password: string;
}

export interface AccountResponse {
  id: string;
  email: string;
  enabled: boolean;
}

export function register(
  registration: RegistrationRequest,
): Promise<AccountResponse> {
  return post<RegistrationRequest, AccountResponse>(
    "/api/accounts/register",
    registration,
  );
}

export function getAccount(): Promise<AccountResponse> {
  return get<AccountResponse>("/api/accounts/me");
}

export interface Pulse {
  status: string;
}

export function healthCheck(): Promise<Pulse> {
  return get<Pulse>("/api/accounts/health");
}
