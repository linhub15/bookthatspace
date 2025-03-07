import { useState } from "react";
import { useRooms } from "./hooks";
import { availabilityRoute, facilityRoute } from "./public.routes";
import { Temporal } from "@js-temporal/polyfill";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/clients/supabase";
import { maskHourlyRate, maskPlainTimeRange } from "@/lib/masks/masks";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { AvailabilityCalendar } from "@/components/ui/availability_calendar";
import { mapNumberToDayOfWeek } from "@/lib/maps/day_of_week";
import { cn } from "@/lib/utils/cn";

export function AvailabilityWidget() {
  const { facility_id } = availabilityRoute.useParams();
  const { room_id } = availabilityRoute.useSearch();
  const rooms = useRooms(facility_id);
  const [date, setDate] = useState<Temporal.PlainDate | undefined>();
  const [showDescription, setShowDescription] = useState(false);

  const room = rooms.data?.find((r) => r.id === room_id);
  if (!room) return;

  return (
    <div className="flex flex-col sm:min-h-full sm:items-center sm:justify-center min-h-[calc(100dvh)] max-w-(--breakpoint-lg) space-y-6 py-2 px-2 sm:mx-auto">
      <Card className="flex flex-col max-w-xl p-6 gap-6">
        <div className="flex gap-6 items-center">
          <img
            className="size-28 rounded-xl"
            src={room.images.at(0)?.url}
            alt="default room photo"
          />
          <div className="flex flex-col">
            <div className="font-medium">{room.name}</div>
            <div className="text-sm text-muted">
              Maximum {room.max_capacity} people
            </div>
            <div className="text-sm">
              {maskHourlyRate(room.hourly_rate)}
            </div>
          </div>
        </div>
        <div>
          <p
            className={cn(
              "whitespace-pre-line",
              showDescription ? "" : "line-clamp-2 sm:line-clamp-3",
            )}
          >
            {room.description}
          </p>
          <button
            className="text-sm text-primary"
            type="button"
            onClick={() => setShowDescription((o) => !o)}
          >
            {showDescription ? "Show less" : "Show more"}
          </button>
        </div>
      </Card>
      <Card className="max-w-xl">
        <div className="flex h-fit flex-col md:grid md:grid-cols-5 p-6 gap-6">
          <div className="col-span-3">
            <AvailabilityCalendar
              value={date}
              onChange={(value) => setDate(value)}
              roomId={room_id}
            />
          </div>
          <div className="col-span-2">
            {!date && (
              <div className="w-full h-full flex items-center justify-center text-muted text-center">
                Select a date
              </div>
            )}
            {date &&
              <AvailabilityDisplay roomId={room_id} date={date} />}
          </div>
        </div>
      </Card>
      <Link to={facilityRoute.to} params={{ facility_id: facility_id }}>
        <div className="flex p-4 text-center items-center gap-2">
          <ArrowLeftIcon className="inline w-4 h-4 stroke-2" />
          <span>View facility & rooms</span>
        </div>
      </Link>
    </div>
  );
}

function AvailabilityDisplay(
  props: { roomId?: string; date: Temporal.PlainDate },
) {
  const availability = useAvailability(props.roomId, props.date);

  if (!props.roomId) return <div>Select a room</div>;
  if (availability.isLoading) return <div>Loading...</div>;
  if (!availability.data || availability.data.length === 0) {
    return <div>Not available</div>;
  }

  return (
    <div>
      <h3 className="flex gap-x-2 h-9 items-center">
        <span className="font-medium">
          {props.date.toLocaleString(undefined, {
            weekday: "short",
          })}
        </span>
        <span className="text-muted">
          {props.date.toLocaleString(undefined, {
            day: "numeric",
          })}
        </span>
      </h3>
      <div className="py-3 text-sm text-muted">
        Available times
      </div>
      <div className="py-2 space-y-2">
        {availability.data.map((range, index) => (
          <div key={index}>{maskPlainTimeRange(range[0], range[1])}</div>
        ))}
      </div>
    </div>
  );
}

function useAvailability(roomId?: string, date?: Temporal.PlainDate) {
  const listRoomAvailability = async (
    roomId: string,
    date: Temporal.PlainDate,
  ) => {
    const { data, error } = await supabase
      .from("room_availability")
      .select()
      .eq("room_id", roomId)
      .eq("day_of_week", mapNumberToDayOfWeek[date.dayOfWeek]);

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
