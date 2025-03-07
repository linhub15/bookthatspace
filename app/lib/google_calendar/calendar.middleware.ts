import { createMiddleware } from "@tanstack/react-start";
import { auth, calendar, type calendar_v3 } from "@googleapis/calendar";

export const googleCalendarMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    // todo: find a way to store and expose
    const refreshToken = "";

    const oAuth2 = new auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    oAuth2.setCredentials({ refresh_token: refreshToken });

    const instance = calendar({ version: "v3", auth: oAuth2 });

    return await next({ context: { calendar: instance } });
  },
);
