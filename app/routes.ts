import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx", [
    index("routes/home/browse.tsx"),
    route("channel", "routes/home/channel.tsx"),
    route("watch", "routes/home/watch.tsx"),
  ]),
] satisfies RouteConfig;
