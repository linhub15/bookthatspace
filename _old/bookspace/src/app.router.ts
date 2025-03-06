import {
  createRootRoute,
  createRoute,
  createRouter,
  RoutePaths,
} from "@tanstack/react-router";
import { App } from "./app";
import {
  emailConfirmationRoute,
  forgotPasswordRoute,
  loginRoute,
  resetPasswordRoute,
  signupRoute,
} from "./auth/auth.routes";
import { dashboardRoutes } from "./features/dashboard/dashboard.routes";
import { NotFound } from "./components/not_found";
import { publicBookingRoutes } from "./features/public/public.routes";
import { renterPortalRoutes } from "./features/renter_portal/renter_portal.routes";

const rootRoute = createRootRoute();

const appIndex = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const splatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  component: NotFound,
});

const routeTree = rootRoute.addChildren([
  appIndex,
  splatRoute,
  loginRoute,
  signupRoute,
  emailConfirmationRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  dashboardRoutes,
  publicBookingRoutes,
  renterPortalRoutes,
]);

const router = createRouter({ routeTree });

type AnonPaths = RoutePaths<typeof publicBookingRoutes>;
type DashboardPaths = RoutePaths<typeof dashboardRoutes>;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export { type AnonPaths, type DashboardPaths, rootRoute, router };
