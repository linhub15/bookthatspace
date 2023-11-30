import { redirect, RootRoute, Route, Router } from "@tanstack/react-router";
import { Signup } from "./auth/signup";
import { Profile } from "./profile/profile";
import { checkAuthenticated } from "./auth/use_authenticated.signal";
import { App } from "./app";
import { LoginPassword } from "./auth/login_password";
import { EmailConfirmation } from "./auth/email_confirmation";
import { ForgotPassword } from "./auth/forgot_password";
import { ResetPassword } from "./auth/reset_password";

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
        to: "/profile",
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
        to: "/profile",
        replace: true,
      });
    }
  },
});

const profileRoute = new Route({
  id: "profile",
  getParentRoute: () => rootRoute,
  path: "profile",
  component: Profile,
  beforeLoad: async () => {
    const authed = await checkAuthenticated();
    if (!authed) {
      throw redirect({
        to: "/login",
        search: { redirect: "/profile" },
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
  profileRoute,
  emailConfirmationRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
