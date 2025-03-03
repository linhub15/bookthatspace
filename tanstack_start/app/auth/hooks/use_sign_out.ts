import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authenticated } from "./use_authenticated.signal";

export function useSignOut() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      // todo: implement
      // await supabase.auth.signOut();
      authenticated.value = false;
      navigate({ to: "/" });
    },
  });
}
