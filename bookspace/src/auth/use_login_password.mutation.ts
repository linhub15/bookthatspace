import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { authenticated } from "./use_authenticated.signal";
import { loginRoute } from "./auth.routes";
import { AppPaths } from "../app.router";

export function useLoginWithPassword() {
  const { redirect } = useSearch({ from: loginRoute.id });
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
