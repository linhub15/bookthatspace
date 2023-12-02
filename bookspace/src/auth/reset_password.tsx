import { useState } from "react";
import { supabase } from "../supabase";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Password updated");

      return navigate({ to: "/dashboard/profile" });
    },
  });

  return (
    <div>
      Reset your password
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={() => resetPassword.mutateAsync(newPassword)}>
        Reset password
      </button>
    </div>
  );
}
