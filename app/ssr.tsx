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
  DATABASE_URL: z.string(),
  VITE_AUTH_URL: z.string(),
  AUTH_SECRET: z.string(),
  GOOGLE_OAUTH_ID: z.string(),
  GOOGLE_OAUTH_SECRET: z.string(),
});

env.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}
