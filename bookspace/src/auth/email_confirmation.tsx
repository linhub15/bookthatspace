import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { emailConfirmationRoute } from "./auth.routes";

export function EmailConfirmation() {
  const [canResend, setCanResend] = useState(false);
  const { email } = emailConfirmationRoute.useParams();
  const resendConfirmation = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setCanResend(false);
    alert("Confirmation email sent!");
    setTimeout(() => setCanResend(true), 5000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setCanResend(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-6 w-full max-w-xl mx-auto mt-20 p-10 shadow rounded-lg bg-white">
      <h2 className="text-2xl text-center">🎉 Account created</h2>
      <p>
        An email was sent to <strong>{email}</strong> with a confirmation link.
      </p>
      <p>
        Check your email to complete your account.
      </p>
      {canResend && (
        <div>
          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => resendConfirmation()}
          >
            Resend confirmation email
          </button>
        </div>
      )}
    </div>
  );
}
