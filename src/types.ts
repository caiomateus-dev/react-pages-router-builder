import type { RouteObject } from "react-router";

export interface ExtendedRouteObject extends Omit<RouteObject, "children"> {
  type?: "page" | "layout";
  children?: ExtendedRouteObject[];
}

export interface FileSystemRouterOptions {
  pagesDir?: string;
  debug?: boolean;
}
