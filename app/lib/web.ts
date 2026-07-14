const DEVICE_ID_KEY = "qd_device_id";

export const HEADER_DEVICE_ID_KEY = "X-Device-Id";

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export const url = (host: string, ...paths: string[]): string => {
  const normalizedHost = host.replace(/\/+$/, "");

  const normalizedPaths = paths
    .filter((path) => path != null && path !== "")
    .map((path) => path.replace(/^\/+|\/+$/g, ""));

  return [normalizedHost, ...normalizedPaths].join("/");
};

export function queryString(object: any): string {
  if (!object) {
    return "";
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(object)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      if (typeof value === "string") {
        params.append(key, value);
      }
    }
  }

  const query = params.toString();
  return query ? query : "";
}
