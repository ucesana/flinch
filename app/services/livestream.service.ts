import { get, post, put } from "./rest.service";

export interface CreateLiveStreamRequest {
  channelId: string;
  name: string;
  description: string;
}

export interface LiveStreamResponse {
  id: string;
  name: string;
  description: string;
  thumbnailContentType: string;
  channelId: string;
  createdAt: string;
  startedAt: string | null;
  stoppedAt: string | null;
}

export interface PostChatRequest {
  streamId: string;
  accountId: string;
  message: string;
}

export interface LiveStreamChatResponse {
  id: string;
  streamId: string;
  channelSubscriptionId: string;
  message: string;
}

export function createStream(
  request: CreateLiveStreamRequest,
): Promise<LiveStreamResponse> {
  return post<CreateLiveStreamRequest, LiveStreamResponse>(
    "/api/livestreams",
    request,
  );
}

export function getStream(id: string): Promise<LiveStreamResponse> {
  return get<LiveStreamResponse>(`/api/livestreams/${id}`);
}

export function listStreams(channelId: string): Promise<LiveStreamResponse[]> {
  return get<LiveStreamResponse[]>(
    `/api/livestreams?channelId=${encodeURIComponent(channelId)}`,
  );
}

export function browseStreams(): Promise<LiveStreamResponse[]> {
  return get<LiveStreamResponse[]>("/api/livestreams/browse");
}

export function startStream(id: string): Promise<void> {
  return post<void, void>(`/api/livestreams/${id}/start`);
}

export function stopStream(id: string): Promise<void> {
  return post<void, void>(`/api/livestreams/${id}/stop`);
}

export function updateThumbnail(
  id: string,
  image: Blob,
  contentType: string,
): Promise<void> {
  return put<Blob, void>(
    `/api/livestreams/${id}/thumbnail`,
    image,
    contentType,
  );
}

export function getThumbnail(id: string, contentType: string): Promise<Blob> {
  return get<Blob>(`/api/livestreams/${id}/thumbnail`, contentType);
}

export function postChat(
  request: PostChatRequest,
): Promise<LiveStreamChatResponse> {
  return post<PostChatRequest, LiveStreamChatResponse>(
    "/api/livestreams/chats",
    request,
  );
}

export function listChats(streamId: string): Promise<LiveStreamChatResponse[]> {
  return get<LiveStreamChatResponse[]>(
    `/api/livestreams/chats?streamId=${encodeURIComponent(streamId)}`,
  );
}
