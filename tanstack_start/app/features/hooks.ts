import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProfile } from "../server/get_profile.server";
import { getFacility } from "../server/get_facility.server";

export function useProfile() {
  const fn = useServerFn(getProfile);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await fn();
    },
  });
}

export function useFacility() {
  const fn = useServerFn(getFacility);

  return useQuery({
    queryKey: ["facility"],
    queryFn: async () => {
      return await fn();
    },
  });
}
