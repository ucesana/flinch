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
