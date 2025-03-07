import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Temporal } from "temporal-polyfill";
import { listRoomBookingsFn } from "../functions/list_room_bookings.fn";
import { asPlainDate } from "@/lib/types/safe_date";

type Args = {
  type?: "upcoming" | "pending" | "past" | "all";
};
export function useRoomBookingList({ type }: Args) {
  const today = Temporal.Now.plainDateISO();
  const listRoomBookings = useServerFn(listRoomBookingsFn);

  return useQuery({
    queryKey: ["room_bookings", type, today],
    refetchOnMount: false,
    queryFn: async () => {
      const bookings = await listRoomBookings();

      switch (true) {
        case type === "upcoming":
          return bookings.filter((b) => b.status === "scheduled" // && Temporal.PlainDate.compare(asPlainDate(b.start), today) >= 0
          );
        case type === "past":
          return bookings.filter((b) =>
            b.status === "scheduled" &&
            Temporal.PlainDate.compare(asPlainDate(b.start), today) < 0
          );
        default:
          return bookings;
      }
    },
  });
}
