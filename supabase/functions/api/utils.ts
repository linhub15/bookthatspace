/** https://supabase.com/docs/guides/functions/secrets#default-secrets */
type SupabaseEnvOptions =
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_DB_URL";

/** .env */
type EnvOptions =
  | "RESEND_API_KEY"
  | "RESEND_FROM_EMAIL"
  | "HASH_SALT"
  | "API_EXTERNAL_URL"
  | "FRONTEND_URL";

/** @throws Error when environment value is falsey */
export function getEnv(
  key: EnvOptions | SupabaseEnvOptions,
  defaultValue?: string,
): string {
  const env = Deno.env.get(key);
  if (env) return env;
  if (defaultValue) return defaultValue;
  throw new Error(
    `${key} is missing from environment variables and no default was provided.`,
  );
}

/** Allows for syntax highlighting html within a template string */
export const html = (strings: TemplateStringsArray, ...values: string[]) =>
  String.raw({ raw: strings }, ...values);
