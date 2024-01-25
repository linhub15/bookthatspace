import { Link, useNavigate } from "@tanstack/react-router";
import {
  useDeletePhoto,
  useRoom,
  useRoomAvailability,
  useRoomPhotos,
  useUploadPhoto,
} from "./hooks";
import { BackButton } from "@/src/components/buttons/back_button";
import { Card } from "@/src/components/card";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { maskHourlyRate } from "@/src/masks/masks";
import { Temporal } from "@js-temporal/polyfill";
import { useWeekCalendar } from "./use_week_calendar";

import { useChangeAvailabilityModal } from "./change_availability/use_change_availability_modal";
import { useDeleteRoomModal } from "./use_delete_room_modal";
import { useEditRoomModal } from "./use_edit_room_modal";
import { roomRoute, roomsRoute } from "../dashboard.routes";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { XCircleIcon } from "@heroicons/react/16/solid";

// todo(hubert): think about statuses
// - incomplete info (availability, photos)

export function Room() {
  const { room_id } = roomRoute.useParams();
  const navigate = useNavigate();

  const editRoom = useEditRoomModal({ roomId: room_id });
  const deleteRoom = useDeleteRoomModal({
    roomId: room_id,
    onSuccess: () => {
      navigate({ to: roomsRoute.to });
    },
  });

  const availability = useRoomAvailability(room_id);
  const photos = useRoomPhotos(room_id);
  const deletePhoto = useDeletePhoto(room_id);

  const calendar = useWeekCalendar();

  const changeAvailability = useChangeAvailabilityModal({
    roomId: room_id,
  });

  const { data: room } = useRoom(room_id);
  if (!room) return <div>loading...</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full justify-between">
          <Link className="w-fit" to={roomsRoute.to}>
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
                  <p className="text-sm text-gray-500">
                    {room.address}
                  </p>
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
                    {maskHourlyRate(room.hourly_rate)}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Room Capacity
                  </dt>
                  <dd className="leading-6 text-gray-700">
                    {room.max_capacity}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Description
                  </dt>
                  <dd className="leading-6 text-gray-700">
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
                photos.data.map(({ photoId, url }) => (
                  <div className="relative">
                    <button
                      className="absolute top-0 right-0 p-1 m-1"
                      onClick={() =>
                        deletePhoto.mutateAsync({ photoId: photoId })}
                    >
                      <XCircleIcon className="w-6 bg-white rounded-full">
                      </XCircleIcon>
                    </button>
                    <img
                      className="w-full rounded-lg aspect-[1/1] object-cover"
                      src={url}
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
          </div>

          {!!availability.data?.length && (
            <calendar.WeekView>
              {availability.data?.map((a, index) => (
                <calendar.Event
                  key={index}
                  weekday={a.day_of_week}
                  start={Temporal.PlainTime.from(a.start)}
                  end={Temporal.PlainTime.from(a.end)}
                />
              ))}
            </calendar.WeekView>
          )}
        </Card>
      </div>
      <editRoom.Modal />
      <deleteRoom.Modal />
      <changeAvailability.Modal />
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
