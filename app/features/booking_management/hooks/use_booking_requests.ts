import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRoomBookingsFn } from "../functions/list_room_bookings.fn";

export function useBookingRequests() {
  const listRoomBookingRequests = useServerFn(listRoomBookingsFn);

  const query = useQuery({
    queryKey: ["room_bookings", "requests"],
    queryFn: async () => {
      const data = await listRoomBookingRequests();
      return data;
    },
  });

  return query;
}
