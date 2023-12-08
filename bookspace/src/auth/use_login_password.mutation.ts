import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useNavigate } from "@tanstack/react-router";
import { authenticated } from "./use_authenticated.signal";
import { AppPaths } from "../app.router";

export function useLoginWithPassword(redirect?: string) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const response = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
        options: {},
      });

      if (response.error) {
        alert(response.error.message);
        return;
      }

      authenticated.value = true;
      return navigate({ to: redirect as AppPaths });
    },
  });
  return mutation;
}
