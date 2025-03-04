import { createRoute, redirect } from "@tanstack/react-router";
import { Login } from "./login";
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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: Login,
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

const signupRoute = createRoute({
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

const emailConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "confirm-email/$email",
  component: EmailConfirmation,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "forgot-password",
  component: ForgotPassword,
});

const resetPasswordRoute = createRoute({
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
