import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./auth";
import { getWebRequest } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getWebRequest()?.headers;

    if (!headers) {
      throw new Error("No headers on web request");
    }

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session) {
      throw new Error("No session found");
    }

    return await next({ context: { session } });
  },
);
