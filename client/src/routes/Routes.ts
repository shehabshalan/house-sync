import { generatePath } from "react-router";

export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard/spaces",
  AUTH: "/auth",
  NOT_FOUND: "/notFound",
  BUGGY: "/buggy",
  ANY: "/*",
};

export const getRoute = (route: any, params: any) => {
  return generatePath(route, params);
};
