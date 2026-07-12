import { get, post } from "./rest.service";

export interface CreateChannelRequest {
  accountId: string;
  name: string;
  description: string;
}

export interface ChannelResponse {
  id: string;
  name: string;
  description: string;
  accountId: string;
}

export interface SubscribeRequest {
  channelId: string;
}

export interface BanRequest {
  accountId: string;
  reason: string;
}

export interface ChannelSubscriptionResponse {
  id: string;
  channelId: string;
  accountId: string;
  banned: boolean;
  banReason: string | null;
  bannedAt: string | null;
}

export function createChannel(
  request: CreateChannelRequest,
): Promise<ChannelResponse> {
  return post<CreateChannelRequest, ChannelResponse>("/api/channels", request);
}

export function getChannel(id: string): Promise<ChannelResponse> {
  return get<ChannelResponse>(`/api/channels/${id}`);
}

export function listChannels(accountId?: string): Promise<ChannelResponse[]> {
  const path = accountId
    ? `/api/channels?accountId=${encodeURIComponent(accountId)}`
    : "/api/channels";

  return get<ChannelResponse[]>(path);
}

export function subscribe(
  request: SubscribeRequest,
): Promise<ChannelSubscriptionResponse> {
  return post<SubscribeRequest, ChannelSubscriptionResponse>(
    "/api/channels/subscriptions",
    request,
  );
}

export function listSubscriptions(): Promise<ChannelSubscriptionResponse[]> {
  return get<ChannelSubscriptionResponse[]>("/api/channels/subscriptions");
}

export function listChannelSubscribers(
  channelId: string,
): Promise<ChannelSubscriptionResponse[]> {
  return get<ChannelSubscriptionResponse[]>(
    `/api/channels/${channelId}/subscriptions`,
  );
}

export function banAccount(
  channelId: string,
  request: BanRequest,
): Promise<void> {
  return post<BanRequest, void>(
    `/api/channels/${channelId}/subscriptions/ban`,
    request,
  );
}
