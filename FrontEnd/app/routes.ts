import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("sales", "routes/sales.tsx")
] satisfies RouteConfig;
