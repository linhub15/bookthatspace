import { api } from "@/app/clients/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { booking_id: string }) => {
      await api.accept_booking({ booking_id: args.booking_id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
