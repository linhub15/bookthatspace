import { useMutation, useQuery } from "@tanstack/react-query";
import {
  supabase,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/clients/supabase";
import { signal } from "@preact/signals";
import { Address } from "@/lib/types/address";

export const registered = signal(false);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select().single();
      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
  });
}

export function useFacility() {
  return useQuery({
    queryKey: ["facility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility")
        .select()
        .returns<(Tables<"facility"> & { address: Address })[]>()
        .maybeSingle();

      if (error) {
        alert(error.message);
        return;
      }

      return data;
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
