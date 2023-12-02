import { RootRoute, RoutePaths, Router } from "@tanstack/react-router";
import { App } from "./app";
import {
  emailConfirmationRoute,
  forgotPasswordRoute,
  loginRoute,
  resetPasswordRoute,
  signupRoute,
} from "./auth/auth.routes";
import { dashboardRoutes } from "./dashboard/dashboard.routes";

const rootRoute = new RootRoute({
  component: App,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  emailConfirmationRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  dashboardRoutes,
]);

const router = new Router({ routeTree });

type AppPaths = RoutePaths<typeof routeTree>;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export { type AppPaths, rootRoute, router };
