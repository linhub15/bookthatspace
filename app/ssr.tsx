import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";
import { z } from "zod";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);

const env = z.object({
  VITE_AUTH_URL: z.string(),
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  GOOGLE_OAUTH_ID: z.string(),
  GOOGLE_OAUTH_SECRET: z.string(),
  UPLOADTHING_TOKEN: z.string(),
  RESEND_API_KEY: z.string(),
});

env.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}
