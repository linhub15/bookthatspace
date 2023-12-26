import { redirect } from "@tanstack/react-router";
import { supabase } from "../supabase";

export async function registeredGuard() {
  const { data } = await supabase.from("profile").select("id").limit(1)
    .single();

  const registered = !!data?.id;

  if (!registered) {
    throw redirect({
      to: "/register",
    });
  }
}
