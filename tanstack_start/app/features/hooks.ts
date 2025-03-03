import { useMutation, useQuery } from "@tanstack/react-query";
import { signal } from "@preact/signals";
import { useServerFn } from "@tanstack/react-start";
import { getProfile } from "../server/get_profile.server";
import { getFacility } from "../server/get_facility.server";

export const registered = signal(false);

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const fn = useServerFn(getProfile);
      return await fn();
    },
  });
}

export function useFacility() {
  return useQuery({
    queryKey: ["facility"],
    queryFn: async () => {
      const fn = useServerFn(getFacility);
      return await fn();
    },
  });
}

// export function useRegisterProfile() {
//   return useMutation({
//     mutationFn: async (profile: TablesInsert<"profile">) => {
//       const { data } = await supabase.auth.getUser();

//       if (data.user?.id === profile.id) {
//         await supabase.from("profile").insert(profile);
//       }
//     },
//   });
// }

// export function useUpdateProfile() {
//   return useMutation({
//     mutationFn: async (profile: TablesUpdate<"profile">) => {
//       await supabase.from("profile").update(profile);
//     },
//   });
// }
