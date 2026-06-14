import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx", [
    index("routes/home/browse.tsx"),
    route("channel", "routes/home/stream.tsx"),
    route("watch", "routes/home/watch.tsx"),
  ]),
] satisfies RouteConfig;
