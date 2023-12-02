import { redirect, Route } from "@tanstack/react-router";
import { rootRoute } from "../app.router";
import { LoginPassword } from "./login_password";
import { checkAuthenticated } from "./use_authenticated.signal";
import { Signup } from "./signup";
import { EmailConfirmation } from "./email_confirmation";
import { ForgotPassword } from "./forgot_password";
import { ResetPassword } from "./reset_password";
import { z } from "zod";

async function authGuard(redirectTo: string) {
  const authed = await checkAuthenticated();
  if (!authed) {
    throw redirect({
      to: "/login",
      search: { redirect: redirectTo },
    });
  }
}

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginPassword,
  validateSearch: z.object({ redirect: z.string().optional() }),
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

export {
  authGuard,
  emailConfirmationRoute,
  forgotPasswordRoute,
  loginRoute,
  resetPasswordRoute,
  signupRoute,
};
