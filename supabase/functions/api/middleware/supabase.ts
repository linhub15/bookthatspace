import {
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from "@supabase/supabase-js";
import { MiddlewareHandler } from "hono/types.ts";
import { Database } from "@/lib/types/supabase_types.d.ts";
import { getEnv } from "../utils.ts";

/** @default {mode} "auth"  */
export function supabase(
  mode: "auth" | "anon" = "auth",
): MiddlewareHandler<SupabaseEnv> {
  return async (c, next) => {
    const authHeader = c.req.header("authorization");

    if (!authHeader && mode === "auth") {
      return new Response("Unauthorized", { status: 403 });
    }

    const options = mode === "auth"
      ? {
        global: { headers: { Authorization: authHeader } },
      } as SupabaseClientOptions<"public">
      : undefined;

    const client = createClient<Database>(
      getEnv("SUPABASE_URL"),
      getEnv("SUPABASE_ANON_KEY"),
      options,
    );

    c.set("supabase", client);
    await next();
  };
}

export type SupabaseEnv = {
  Variables: {
    supabase: SupabaseClient<Database>;
  };
};
