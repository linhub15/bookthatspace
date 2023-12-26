import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { Tables, TablesInsert, TablesUpdate } from "../types/supabase_types";
import { signal } from "@preact/signals";

export const registered = signal(false);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select();
      if (error) {
        alert(error.message);
        return;
      }

      return data.at(0) as Tables<"profile">;
    },
  });
}

export function useRegisterProfile() {
  return useMutation({
    mutationFn: async (profile: TablesInsert<"profile">) => {
      const { data } = await supabase.auth.getUser();

      if (data.user?.id === profile.id) {
        await supabase.from("profile").insert(profile);
      }
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (profile: TablesUpdate<"profile">) => {
      await supabase.from("profile").update(profile);
    },
  });
}
