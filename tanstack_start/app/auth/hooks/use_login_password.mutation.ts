import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../clients/supabase";
import { useNavigate } from "@tanstack/react-router";
import { authenticated } from "./use_authenticated.signal";
import { DashboardPaths } from "../../app.router";

export function useLoginWithPassword(redirect?: string) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (params: { email: string; password: string }) => {
      const response = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
        options: {},
      });

      if (!response.error) return;

      if (response.error.message.toLowerCase().includes("email")) {
        return await navigate({
          to: "/confirm-email/$email",
          params: { email: params.email },
        });
      }

      alert(response.error.message);
      throw response.error;
    },
    onSuccess: () => {
      authenticated.value = true;
      navigate({ to: redirect as DashboardPaths, params: {} });
    },
  });
  return mutation;
}
