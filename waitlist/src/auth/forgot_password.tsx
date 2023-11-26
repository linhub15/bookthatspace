import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useState } from "react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.protocol}//${location.host}/reset-password`,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert(`Password reset email sent to ${email}!`);
    },
  });
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {!mutation.isPending &&
        (
          <button onClick={() => mutation.mutateAsync(email)}>
            Reset password
          </button>
        )}
    </div>
  );
}
