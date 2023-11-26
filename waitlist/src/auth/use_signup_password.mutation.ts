import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useNavigate } from "@tanstack/react-router";

type UserMeta = {
  name: string;
};

export function useSignupWithPassword() {
  const navigate = useNavigate();
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
        return;
      }

      return navigate({
        to: "/confirm-email/$email",
        params: { email: args.email },
      });
    },
  });
}
