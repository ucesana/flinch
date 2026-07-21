import { url } from "~/lib/web";
import { serialise } from "~/lib/json";

export type THeaders = Record<string, string>;

export type TRequestOptions<TRequestBody> = {
  body?: TRequestBody;
  headers?: THeaders;
};

const BASE_URL = import.meta.env.VITE_REST_BASE_URL;

let refreshPromise: Promise<void> | null = null;

const refresh = async (): Promise<void> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await fetch(url(BASE_URL, "/api/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Session expired");
    }
  })();

  try {
    await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const request = async <TRequestBody, TResponseBody>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  options?: TRequestOptions<TRequestBody>,
): Promise<TResponseBody> => {
  const headers = {
    "Content-Type": "application/json",
    ...(options?.headers ?? {}),
  };

  const makeRequest = () =>
    fetch(url(BASE_URL, path), {
      method,
      headers,
      credentials: "include",
      body: options?.body
        ? hasContentType(headers, "application/json")
          ? serialise(options.body)
          : (options.body as unknown as Blob)
        : undefined,
    });

  let response = await makeRequest();

  if (response.status === 401 && path !== "/api/auth/refresh") {
    try {
      await refresh();
    } catch {
      // Session cannot be recovered.
      // Clear local auth state and redirect.
      // TODO: route to login or something
      throw new Error("Session expired");
    }

    response = await makeRequest();
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as TResponseBody;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<TResponseBody>;
  }

  if (contentType.includes("image")) {
    return response.blob() as Promise<TResponseBody>;
  }

  return undefined as TResponseBody;
};

function hasContentType(headers: THeaders, contentType: string): boolean {
  console.log("headers ", headers);
  if (headers) {
    return headers["Content-Type"] === contentType;
  }
  return false;
}
