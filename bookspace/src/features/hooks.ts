import { useMutation, useQuery } from "@tanstack/react-query";
import { signal } from "@preact/signals";
import type { Address } from "@/lib/types/address";

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
