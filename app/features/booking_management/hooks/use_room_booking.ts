import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getRoomBookingFn } from "../functions/get_room_booking.fn";

export function useRoomBooking(bookingId: string) {
  const roomBooking = useServerFn(getRoomBookingFn);
  return useQuery({
    queryKey: ["room_bookings", bookingId],
    queryFn: async () => {
      const booking = await roomBooking({ data: { bookingId } });

      return booking;
    },
  });
}
