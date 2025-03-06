import { useQuery } from "@tanstack/react-query";

export function useBookingPublic(bookingId: string) {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      return { bookedByEmail: "test" };
    },
  });
}
