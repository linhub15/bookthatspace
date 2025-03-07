import { Card } from "@/components/card";
import { AvailabilityCalendar } from "@/components/ui/availability_calendar";
import { useFacilityPublic } from "@/features/public/hooks/use_facility.public";
import { useRoomAvailabilityPublic } from "@/features/public/hooks/use_room_availability.public";
import { maskHourlyRate, maskPlainTimeRange } from "@/lib/masks/masks";
import { cn } from "@/lib/utils/cn";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Temporal } from "temporal-polyfill";
import { Route as indexRoute } from "./index";

export const Route = createFileRoute("/@/$facilityId/availability")({
  component: RouteComponent,
  validateSearch: (search) => {
    return { roomId: search.roomId as string };
  },
});

function RouteComponent() {
  const { facilityId } = Route.useParams();
  const { roomId } = Route.useSearch();
  const facility = useFacilityPublic(facilityId);

  const [date, setDate] = useState<Temporal.PlainDate | undefined>();
  const [showDescription, setShowDescription] = useState(false);

  const rooms = facility.data?.rooms;
  const room = rooms?.find((r) => r.id === roomId);

  if (!room) {
    return <>Room not found!</>;
  }

  return (
    <div className="flex flex-col sm:min-h-full sm:items-center sm:justify-center min-h-[calc(100dvh)] max-w-(--breakpoint-lg) space-y-6 py-2 px-2 sm:mx-auto">
      <Card className="flex flex-col max-w-xl p-6 gap-6">
        <div className="flex gap-6 items-center">
          <img
            className="size-28 rounded-xl"
            src={room.images.at(0)?.url}
            alt="default room"
          />
          <div className="flex flex-col">
            <div className="font-medium">{room.name}</div>
            <div className="text-sm text-muted">
              Maximum {room.maxCapacity} people
            </div>
            <div className="text-sm">
              {maskHourlyRate(room.hourlyRate)}
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
              roomId={roomId}
            />
          </div>
          <div className="col-span-2">
            {!date && (
              <div className="w-full h-full flex items-center justify-center text-muted text-center">
                Select a date
              </div>
            )}
            {date &&
              <AvailabilityDisplay roomId={roomId} date={date} />}
          </div>
        </div>
      </Card>

      <Link to={indexRoute.to} params={{ facilityId: facilityId }}>
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
  const availability = useRoomAvailabilityPublic(props.roomId, props.date);

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
          <div
            key={
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }
          >
            {maskPlainTimeRange(range[0], range[1])}
          </div>
        ))}
      </div>
    </div>
  );
}
