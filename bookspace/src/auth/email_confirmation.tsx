import { supabase } from "../supabase";

export function EmailConfirmation(
  { email }: { email: string },
) {
  const resendConfirmation = supabase.auth.resend({
    type: "signup",
    email: email,
  });

  return (
    <div>
      Account created. Check your email{" "}
      <pre>{email}</pre>to confirm your account.{" "}
      <button onClick={void resendConfirmation}>
        Resend confirmation email
      </button>
    </div>
  );
}
