import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFacilityPublicFn } from "../functions/get_facility.public.fn";

export function useFacilityPublic(facilityId: string) {
  const getFacility = useServerFn(getFacilityPublicFn);
  return useQuery({
    queryKey: ["facility", facilityId],
    enabled: !!facilityId,
    queryFn: async () => {
      const facility = await getFacility({ data: { facilityId } });

      return facility;
    },
  });
}
