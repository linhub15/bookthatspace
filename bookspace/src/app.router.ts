import {
  redirect,
  RootRoute,
  Route,
  RoutePaths,
  Router,
} from "@tanstack/react-router";
import { Signup } from "./auth/signup";
import { checkAuthenticated } from "./auth/use_authenticated.signal";
import { App } from "./app";
import { LoginPassword } from "./auth/login_password";
import { EmailConfirmation } from "./auth/email_confirmation";
import { ForgotPassword } from "./auth/forgot_password";
import { ResetPassword } from "./auth/reset_password";
import { dashboardRoutes } from "./dashboard/dashboard.routes";

const rootRoute = new RootRoute({
  component: App,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginPassword,
  beforeLoad: async () => {
    const authed = await checkAuthenticated();
    if (authed) {
      throw redirect({
        to: "/dashboard/profile",
        replace: true,
      });
    }
  },
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "signup",
  component: Signup,
  beforeLoad: async () => {
    const authed = await checkAuthenticated();
    if (authed) {
      throw redirect({
        to: "/dashboard/profile",
        replace: true,
      });
    }
  },
});

const emailConfirmationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "confirm-email/$email",
  component: (ctx) => EmailConfirmation({ email: ctx.useParams().email }),
});

const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "forgot-password",
  component: ForgotPassword,
});

const resetPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reset-password",
  component: ResetPassword,
  beforeLoad: async () => {
    const authed = await checkAuthenticated();
    if (!authed) {
      throw redirect({
        to: "/forgot-password",
      });
    }
  },
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
