import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getProfileFn } from "./get_profile.fn";

export function useProfile() {
  const getProfile = useServerFn(getProfileFn);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await getProfile();

      return profile;
    },
    staleTime: 1000,
  });
}
