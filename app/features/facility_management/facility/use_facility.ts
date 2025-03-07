import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFacilityFn } from "./get_facility.fn";

export function useFacility() {
  const getFacility = useServerFn(getFacilityFn);

  return useQuery({
    queryKey: ["facility"],
    queryFn: async () => {
      const facility = await getFacility();

      return facility;
    },
    refetchOnMount: false,
  });
}
