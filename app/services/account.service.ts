import { get, post, patch } from "./rest.service";

export interface AccountResponse {
  id?: string;
  userId?: string;
  name?: string;
}

export interface CreateAccountRequest {
  name?: string;
}

export interface UpdateAccountRequest {
  name?: string;
}

export function createAccount(
  request: CreateAccountRequest,
): Promise<AccountResponse> {
  return post<CreateAccountRequest, AccountResponse>("/api/accounts", request);
}

export function getMyAccounts(): Promise<AccountResponse[]> {
  return get<AccountResponse[]>("/api/accounts/me");
}

export function getAccount(id: string): Promise<AccountResponse> {
  return get<AccountResponse>(`/api/accounts/${id}`);
}

export function updateAccount(
  id: string,
  request: UpdateAccountRequest,
): Promise<AccountResponse> {
  return patch<UpdateAccountRequest, AccountResponse>(
    `/api/accounts/${id}`,
    request,
  );
}
