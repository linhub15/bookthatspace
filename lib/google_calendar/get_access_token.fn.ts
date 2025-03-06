import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";

/** https://developers.google.com/identity/protocols/oauth2/web-server#offline */
export const getAccessToken = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // todo: get the user's refresh token from the user_provider
    // allows programatic access to the user's google calendar
    const refreshToken = "";

    const url = new URL("https://oauth2.googleapis.com/token");
    const response = await fetch(url, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      body: new URLSearchParams({
        "client_id": process.env.GOOGLE_CLIENT_ID!,
        "client_secret": process.env.GOOGLE_CLIENT_SECRET!,
        "refresh_token": refreshToken,
        "grant_type": "refresh_token",
      }),
    });

    return await response.json() as {
      "access_token": string;
      "expires_in": number;
      "scope": string;
      "token_type": "Bearer";
    };
  });
