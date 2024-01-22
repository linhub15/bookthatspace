import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { MiddlewareHandler } from "hono/types.ts";
import { Database } from "@/lib/types/supabase_types.d.ts";

export function supabaseAuth(): MiddlewareHandler<SupabaseEnv> {
  return async (c, next) => {
    const authHeader = c.req.header("authorization");

    if (!authHeader) {
      return new Response("Unauthorized", { status: 403 });
    }

    const client = createClient<Database>(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      { global: { headers: { Authorization: authHeader } } },
    );

    c.set("supabase", client);
    await next();
  };
}

export type SupabaseEnv = {
  Variables: {
    supabase: SupabaseClient;
  };
};
