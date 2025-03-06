import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  acceptBookingFn,
  type AcceptBookingRequest,
} from "./accept_booking.fn";

export function useAcceptBooking() {
  const acceptBooking = useServerFn(acceptBookingFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: AcceptBookingRequest) => {
      await acceptBooking({ data: args });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
