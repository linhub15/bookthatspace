import { createClient } from "@supabase/supabase-js";
import type { Database } from "@lib/types/supabase_types";
export type * from "@lib/types/supabase_types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

supabase.auth.onAuthStateChange((event, session) => {
  if (!session) return;

  const saveGoogleRefreshToken = async () => {
    if (event !== "SIGNED_IN" || !session.provider_refresh_token) return;
    await supabase.from("user_provider").upsert({
      refresh_token: session.provider_refresh_token,
    });
  };

  /**
   * await on other Supabase function here
   * this runs right after the callback has finished
   * https://supabase.com/docs/reference/javascript/auth-onauthstatechange
   */
  setTimeout(async () => {
    await saveGoogleRefreshToken();
  }, 0);
});
