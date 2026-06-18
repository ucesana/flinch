import { post, get, remove } from "./rest.service";

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

export interface UserResponse {
  userId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface SessionResponse {
  familyId: string;
  user: UserResponse;
  deviceId: string;
  deviceName: string;
  createdAt: string;
  lastUsedAt: string;
}

export function getSessions(): Promise<SessionResponse[]> {
  return get<SessionResponse[]>("/api/accounts/me/sessions");
}

export function getCurrentSession(): Promise<SessionResponse> {
  return get<SessionResponse>("/api/accounts/me/sessions/current");
}

export function revokeSession(familyId: string): Promise<void> {
  return remove(`/api/accounts/me/sessions/${familyId}`);
}
