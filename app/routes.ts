import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("time-core", "routes/time-core.tsx"),
  route("orbit-deck", "routes/orbit-deck.tsx"),
] satisfies RouteConfig;
