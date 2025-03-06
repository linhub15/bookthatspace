import { BackButton } from "@/app/components/buttons/back_button";
import { Card } from "@/app/components/card";
import { maskHourlyRate } from "@/lib/masks/masks";
import {
  PencilSquareIcon,
  PhotoIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "@tanstack/react-router";
import { Temporal } from "temporal-polyfill";
import { useDeletePhoto, useRoomPhotos, useUploadPhoto } from "../hooks";
import { useWeekCalendar } from "./use_week_calendar";

import { XCircleIcon } from "@heroicons/react/16/solid";
import { useMemo, useRef } from "react";
import { roomRoute, roomsOutlet } from "../../dashboard.routes";
import { useRoom } from "./hooks/use_rooms";
import { useCalendars } from "./use_calendars";
import { usePickCalendarModal } from "./use_pick_calendar.modal";

/** @deprecated migrated to /routes/rooms/$roomId instead */
export function Room() {
  const { room_id } = roomRoute.useParams();
  const navigate = useNavigate();

  const photos = useRoomPhotos(room_id);
  const deletePhoto = useDeletePhoto(room_id);

  const availability = useRoomAvailability(room_id);
  const minHours = Math.min(
    ...availability.data?.map((a) => Temporal.PlainTime.from(a.start).hour) ??
      [0],
  );
  const maxHours = Math.max(
    ...availability.data?.map((a) => Temporal.PlainTime.from(a.end).hour) ??
      [24],
  );
  const calendar = useWeekCalendar({
    earliestHour: minHours,
    latestHour: maxHours,
  });

  const pickCalendar = usePickCalendarModal({ roomId: room_id });
  const calendars = useCalendars();
  const { data: room } = useRoom(room_id);
  const linkedCalendar = useMemo(
    () =>
      calendars.data?.find((cal) => cal.calendar.id === room?.googleCalendarId),
    [calendars.data, room?.googleCalendarId],
  );

  if (!room) return <div>loading...</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full justify-between">
          <Link className="w-fit" to={roomsOutlet.to}>
            <BackButton />
          </Link>
          <button
            className="relativeinline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
            type="button"
            onClick={() => deleteRoom.open()}
          >
            Delete Room
          </button>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          <Card>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {room.name}
                  </h3>
                </div>
                <div className="flex flex-shrink-0 gap-4">
                  <button
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    type="button"
                    onClick={() => editRoom.open()}
                  >
                    <PencilSquareIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 pb-8 sm:px-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Hourly Rate
                  </dt>
                  <dd className="leading-6 text-gray-700">
                    {maskHourlyRate(room.hourlyRate)}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="space-x-1">
                    <UserIcon className="inline w-4 text-gray-500 stroke-2" />
                    <span className="text-sm font-medium leading-6 text-gray-900">
                      Maximum Capacity
                    </span>
                  </dt>
                  <dd className="leading-6 text-gray-700">
                    {room.maxCapacity}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Description
                  </dt>
                  <dd className="leading-6 text-gray-700 whitespace-pre-line">
                    {room.description}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Photos
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 px-4 py-5 sm:px-6 gap-4">
              {!!photos.data?.length &&
                photos.data.map(({ id, url }) => (
                  <div className="relative" key={id}>
                    <button
                      className="absolute top-0 right-0 p-1 m-1"
                      onClick={() =>
                        deletePhoto.mutateAsync({ photoId: id })}
                      type="button"
                    >
                      <XCircleIcon className="w-6 bg-white rounded-full">
                      </XCircleIcon>
                    </button>
                    <img
                      className="w-full rounded-lg aspect-[1/1] object-cover"
                      src={url}
                      alt=""
                    />
                  </div>
                ))}
              {true &&
                <AddImage roomId={room.id} />}
            </div>
          </Card>
        </div>

        <Card>
          <div className="px-4 py-5 sm:px-6 border-b border-b-gray-200">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Availability
              </h3>
              <div className="flex flex-shrink-0 gap-4">
                <button
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={() => changeAvailability.open()}
                >
                  <PencilSquareIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </button>
              </div>
            </div>
            <div>
              <button
                className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 ring-1 ring-inset ring-gray-200 text-xs font-medium text-gray-500"
                type="button"
                onClick={() => pickCalendar.open()}
              >
                {linkedCalendar?.calendar
                  ? (
                    <>
                      <div className="relative flex size-2">
                        <div
                          className="relative inline-block size-2 rounded-full"
                          style={{
                            backgroundColor:
                              linkedCalendar.calendar.backgroundColor,
                          }}
                        />
                        <div
                          className="absolute size-full rounded-full animate-ping opacity-75"
                          style={{
                            backgroundColor:
                              linkedCalendar.calendar.backgroundColor,
                          }}
                        />
                      </div>
                      <span>
                        <span className="font-normal">Synced with</span>{" "}
                        {linkedCalendar.calendar.summaryOverride ||
                          linkedCalendar.calendar.summary}
                        {" "}
                      </span>
                    </>
                  )
                  : (
                    <span>
                      No Calendar linked
                    </span>
                  )}
              </button>
            </div>
          </div>

          {!!availability.data?.length && (
            <calendar.WeekView>
              {availability.data?.map((a) => (
                <calendar.Event
                  key={a.id}
                  weekday={a.dayOfWeek}
                  start={Temporal.PlainTime.from(a.start)}
                  end={Temporal.PlainTime.from(a.end)}
                />
              ))}
            </calendar.WeekView>
          )}
        </Card>
      </div>
      <changeAvailability.Modal />
      <pickCalendar.Modal />
    </>
  );
}

function AddImage(props: { roomId: string }) {
  const input = useRef<HTMLInputElement>(null);
  const uploadPhoto = useUploadPhoto({ roomId: props.roomId });

  const upload = async (files: FileList | null) => {
    const file = files?.item(0);
    if (!file) return;

    await uploadPhoto.mutateAsync(file);
  };

  return (
    <button
      type="button"
      className="aspect-[1/1] block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => input.current?.click()}
    >
      <PhotoIcon className="text-gray-500 w-8 mx-auto" />
      <span className="mt-2 block text-sm font-semibold text-gray-800">
        Add Photo
      </span>
      <input
        className="hidden"
        ref={input}
        type="file"
        accept="input/*"
        onChange={(e) => upload(e.target.files)}
      />
    </button>
  );
}
