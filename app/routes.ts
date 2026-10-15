import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("orbit-deck", "routes/orbit-deck.tsx")] satisfies RouteConfig;
