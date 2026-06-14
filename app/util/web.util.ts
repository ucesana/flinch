export const url = (host: string, ...paths: string[]): string => {
  const normalizedHost = host.replace(/\/+$/, "");

  const normalizedPaths = paths
    .filter((path) => path != null && path !== "")
    .map((path) => path.replace(/^\/+|\/+$/g, ""));

  return [normalizedHost, ...normalizedPaths].join("/");
};
