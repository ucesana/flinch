import { request } from "./request.service";

export const post = <RequestBody, ResponseBody>(
  path: string,
  body?: RequestBody,
): Promise<ResponseBody> => {
  return request("POST", path, { body });
};

export const get = <ResponseBody>(
  path: string,
  contentType = "application/json",
): Promise<ResponseBody> => {
  return request("GET", path, { headers: { "Content-Type": contentType } });
};

export const patch = <RequestBody, ResponseBody>(
  path: string,
  body?: RequestBody,
): Promise<ResponseBody> => {
  return request("PATCH", path, { body });
};

export const put = <RequestBody, ResponseBody>(
  path: string,
  body: RequestBody,
  contentType = "application/json",
): Promise<ResponseBody> => {
  return request("PUT", path, {
    body,
    headers: { "Content-Type": contentType },
  });
};

export const remove = (path: string): Promise<void> => {
  return request("DELETE", path);
};
