import { supabase } from "@/src/clients/supabase";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authenticated } from "./use_authenticated.signal";
import { rootRoute } from "@/src/app.router";

export function useSignOut() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
      authenticated.value = false;
      navigate({ to: rootRoute.to });
    },
  });
}
