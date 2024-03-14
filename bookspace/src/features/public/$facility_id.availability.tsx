import { useState } from "react";
import { useRooms } from "./hooks";
import { availabilityRoute } from "./public.routes";
import { DatePicker } from "@/src/components/form/date_picker";
import { Temporal } from "@js-temporal/polyfill";
import { Card } from "@/src/components/card";
import { useQuery } from "@tanstack/react-query";
import { Enums, supabase } from "@/src/clients/supabase";
import { useNavigate } from "@tanstack/react-router";
import { maskPlainTimeRange } from "@/src/masks/masks";

export function AvailabilityWidget() {
  const navigate = useNavigate();
  const { facility_id } = availabilityRoute.useParams();
  const { room_id } = availabilityRoute.useSearch();
  const rooms = useRooms(facility_id);
  const [date, setDate] = useState(Temporal.Now.plainDateISO());

  const selectRoom = (value: string) => {
    return navigate({
      params: { facility_id: facility_id },
      search: () => ({
        room_id: value,
      }),
    });
  };

  return (
    <div className="max-w-screen-lg space-y-4 px-2 sm:mx-auto pt-8">
      <Card>
        <div className="p-4 flex flex-row gap-4">
          <select
            className="block rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={room_id ?? rooms.data?.at(0)?.id}
            onChange={(e) => selectRoom(e.currentTarget.value)}
          >
            {rooms.data?.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <DatePicker value={date} onChange={(v) => setDate(v!)} />
        </div>
        <div className="p-4">
          <AvailabilityDisplay roomId={room_id} date={date} />
        </div>
      </Card>
    </div>
  );
}

function AvailabilityDisplay(
  props: { roomId?: string; date: Temporal.PlainDate },
) {
  const availability = useAvailability(props.roomId, props.date);

  if (!props.roomId) return <div>Select a room</div>;
  if (availability.isLoading) return <div>Loading...</div>;
  if (!availability.data) return <div>No availability found that day</div>;

  return (
    <div>
      <h1>
        {props.date.toLocaleString(undefined, {
          weekday: "long",
        })}
      </h1>
      {availability.data.map((range) => (
        <div>{maskPlainTimeRange(range[0], range[1])}</div>
      ))}
    </div>
  );
}

function useAvailability(roomId?: string, date?: Temporal.PlainDate) {
  const daysOfWeek: Record<number, Enums<"day_of_week">> = {
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
    7: "sun",
  };
  const listRoomAvailability = async (
    roomId: string,
    date: Temporal.PlainDate,
  ) => {
    const { data, error } = await supabase
      .from("room_availability")
      .select()
      .eq("room_id", roomId)
      .eq("day_of_week", daysOfWeek[date.dayOfWeek]);

    if (error) throw error;
    return data;
  };

  const listRoomBookings = async (roomId: string, date: Temporal.PlainDate) => {
    const { data, error } = await supabase
      .from("room_booking")
      .select()
      .eq("room_id", roomId)
      .gte("start", date.toString())
      .lte("start", date.add({ days: 1 }).toString());

    if (error) throw error;
    return data;
  };
  return useQuery({
    queryKey: ["room", roomId, "availability", date?.toJSON()],
    queryFn: async () => {
      if (!roomId || !date) return;
      const availability = await listRoomAvailability(roomId, date);
      const open = availability?.map((a) =>
        [
          Temporal.PlainTime.from(a.start),
          Temporal.PlainTime.from(a.end),
        ] as Range
      );
      const roomBookings = await listRoomBookings(roomId, date);
      const booked = roomBookings?.map((b) =>
        [
          toPlainTime(b.start),
          toPlainTime(b.end),
        ] as Range
      );
      return freeTime(open, booked);
    },
    enabled: !!roomId && !!date,
  });
}

type Range = [Temporal.PlainTime, Temporal.PlainTime];

function freeTime(
  open: Range[],
  booked: Range[],
) {
  const freeTime = [...open];
  for (const range of booked) {
    const found = findRangeIndex(range, freeTime);
    if (found === undefined || found === -1) return;

    const [start, end] = freeTime[found];
    freeTime.splice(found, 1, [start, range[0]], [range[1], end]);
  }

  return freeTime;
}

function findRangeIndex(time: Range, open: Range[]) {
  // assumes no open time ranges overlap
  // full match start and end are within
  const gte = (a: Temporal.PlainTime, b: Temporal.PlainTime) =>
    Temporal.PlainTime.compare(a, b) > 0;

  const lte = (a: Temporal.PlainTime, b: Temporal.PlainTime) =>
    Temporal.PlainTime.compare(a, b) < 0;

  const index = open.findIndex((o) => gte(time[0], o[0]) && lte(time[1], o[1]));
  if (index !== -1) return index;
}

function toPlainTime(utc: string) {
  return Temporal.Instant.from(utc).toZonedDateTimeISO(
    Temporal.TimeZone.from(Temporal.Now.timeZoneId()),
  ).toPlainTime();
}
