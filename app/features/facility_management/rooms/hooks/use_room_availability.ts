import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRoomAvailabilityFn } from "../functions/list_room_availability.fn";

export function useRoomAvailability(roomId: string) {
  const listRoomAvailability = useServerFn(listRoomAvailabilityFn);
  const query = useQuery({
    queryKey: ["rooms", roomId, "availability"],
    queryFn: async () => {
      return await listRoomAvailability({
        data: { roomId },
      });
    },
  });

  return query;
}
