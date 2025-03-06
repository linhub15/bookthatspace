import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../clients/supabase";

type UserMeta = {
  name: string;
};

/** @throws {AuthError} Signup failed */
export function useSignupWithPassword() {
  return useMutation({
    mutationFn: async (
      args: { email: string; password: string; data: UserMeta },
    ) => {
      const response = await supabase.auth.signUp(
        {
          email: args.email,
          password: args.password,
          options: {
            data: args.data,
          },
        },
      );

      if (response.error) {
        alert(response.error.message);
        throw response.error;
      }

      return args.email;
    },
  });
}
