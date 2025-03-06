import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Temporal } from "temporal-polyfill";
import { listRoomAvailabilityPublicFn } from "../functions/list_room_availability.public.fn";

export function useRoomAvailabilityPublic(
  roomId?: string,
  date?: Temporal.PlainDate,
) {
  const listRoomAvailability = useServerFn(listRoomAvailabilityPublicFn);

  return useQuery({
    queryKey: ["room", roomId, "availability", date?.toJSON()],
    enabled: !!roomId && !!date,
    queryFn: async () => {
      if (!roomId || !date) return;

      const freeTime = await listRoomAvailability({
        data: { roomId, date: date.toString() },
      });

      const mapped = freeTime.map(([start, end]) => [
        Temporal.PlainTime.from(start),
        Temporal.PlainTime.from(end),
      ]);

      return mapped;
    },
  });
}
