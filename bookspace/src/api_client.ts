import type { ApiRoutes } from "../../supabase/functions/api/api_routes";

import { hc } from "hono/client";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const client = hc<ApiRoutes>(supabaseUrl);

client.reject_booking.$post({ json: { a: "" } });
