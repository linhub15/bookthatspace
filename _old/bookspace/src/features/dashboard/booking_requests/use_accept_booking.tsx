import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAcceptBooking() {
  const acceptBooking = useServerFn(acceptBookingFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { bookingId: string }) => {
      await acceptBooking({ data: args });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
