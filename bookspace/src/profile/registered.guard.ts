import { redirect } from "@tanstack/react-router";
import { supabase } from "../supabase";
import { registered } from "./hooks";

export async function registeredGuard() {
  if (registered.value) return;

  const { data } = await supabase.from("profile").select("id").limit(1)
    .single();

  registered.value = !!data?.id;

  if (!registered.value) {
    throw redirect({
      to: "/register",
    });
  }
}
