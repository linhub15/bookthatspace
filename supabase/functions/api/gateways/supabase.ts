import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";
import { Database } from "@/lib/types/supabase_types.d.ts";

export const supabase = createClient<Database>(
  Deno.env.get("API_URL") || "",
  Deno.env.get("SERVICE_ROLE_KEY") || "",
);
