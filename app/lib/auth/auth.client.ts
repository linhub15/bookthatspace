import { createAuthClient } from "better-auth/react";

const authServer = new URL("/api/auth", import.meta.env.VITE_APP_URL)
  .toString();

export const authClient = createAuthClient({
  baseURL: authServer,
});
