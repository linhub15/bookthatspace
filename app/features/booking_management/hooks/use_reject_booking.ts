import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  rejectBookingFn,
  type RejectBookingRequest,
} from "../functions/reject_booking.fn";

export function useRejectBooking() {
  const rejectBooking = useServerFn(rejectBookingFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: RejectBookingRequest) => {
      await rejectBooking({ data: args });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
