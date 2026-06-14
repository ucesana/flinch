import { request } from "./request.service";

export const post = <RequestBody, ResponseBody>(
  path: string,
  body?: RequestBody,
): Promise<ResponseBody> => {
  return request("POST", path, body);
};

export const get = <ResponseBody>(path: string): Promise<ResponseBody> => {
  return request("GET", path);
};
