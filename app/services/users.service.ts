import { post, get, remove } from "./rest.service";

export interface UserCreateRequest {
  email: string;
  password: string;
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

export function createUser(
  userCreateRequest: UserCreateRequest,
): Promise<UserResponse> {
  return post<UserCreateRequest, UserResponse>(
    "/api/users/create",
    userCreateRequest,
  );
}

export function getUser(): Promise<UserResponse> {
  return get<UserResponse>("/api/users/me");
}

export function getSessions(): Promise<SessionResponse[]> {
  return get<SessionResponse[]>("/api/users/me/sessions");
}

export function getCurrentSession(): Promise<SessionResponse> {
  return get<SessionResponse>("/api/users/me/sessions/current");
}

export function revokeSession(familyId: string): Promise<void> {
  return remove(`/api/users/me/sessions/${familyId}`);
}
