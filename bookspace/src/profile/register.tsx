import { Route, useNavigate } from "@tanstack/react-router";
import { useRegisterProfile } from "./hooks";
import { rootRoute } from "../app.router";
import { supabase } from "../supabase";
import { useEffect } from "react";

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

export function Register() {
  const mutation = useRegisterProfile();
  const navigate = useNavigate();

  const register = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await mutation.mutateAsync({
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata.name,
    }, {
      onSuccess: async () => {
        await navigate({ to: "/", replace: false });
      },
    });
  };

  useEffect(() => {
    register();
  }, []);
  return (
    <div>
      Setting up your profile...
    </div>
  );
}
