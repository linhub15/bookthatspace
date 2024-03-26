import { SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "../../utils.ts";
import { Database } from "@/lib/types/supabase_types.d.ts";

/** https://developers.google.com/identity/protocols/oauth2/web-server#offline */
export async function getAccessToken(
  _request: undefined,
  deps: { supabase: SupabaseClient<Database> },
) {
  const { data, error } = await deps.supabase
    .from("user_provider")
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const refreshToken = data.refresh_token;

  const url = new URL("https://oauth2.googleapis.com/token");
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    body: new URLSearchParams({
      "client_id": getEnv("GOOGLE_CLIENT_ID"),
      "client_secret": getEnv("GOOGLE_CLIENT_SECRET"),
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
}
