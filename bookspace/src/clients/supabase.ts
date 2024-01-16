import { createClient } from "@supabase/supabase-js";
import type { Database } from "@lib/types/supabase_types";
export type * from "@lib/types/supabase_types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
