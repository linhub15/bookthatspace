import { BackButton } from "@/components/buttons/back_button";
import { Card } from "@/components/card";
import {
  useRoomAvailability,
} from "@/features/facility_management/rooms/hooks/use_room_availability";
import { ChangeRoomAvailabilityModalButton } from "@/features/facility_management/rooms/components/change_room_availability_modal_button";
import { DeleteRoomModalButton } from "@/features/facility_management/rooms/components/delete_room_modal_button";
import { EditRoomModalButton } from "@/features/facility_management/rooms/components/edit_room_modal_button";
import { useRoom } from "@/features/facility_management/rooms/hooks/use_rooms";
import { useWeekCalendar } from "@/features/facility_management/rooms/use_week_calendar";
import { maskHourlyRate } from "@/lib/masks/masks";
import { PhotoIcon, UserIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Temporal } from "temporal-polyfill";
import { UploadDropzone } from "@/lib/file_store/uploadthing.components";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@/components/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteImage } from "@/features/facility_management/rooms/hooks/use_delete_image";

export const Route = createFileRoute("/dashboard/facility/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  const navigate = useNavigate();
  const { data: room } = useRoom(roomId);

  const deleteImage = useDeleteImage();

  if (!room) {
    redirect({ to: ".." });
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex w-full justify-between">
          <Link className="w-fit" to="..">
            <BackButton />
          </Link>
          <DeleteRoomModalButton
            roomId={room.id}
            onSuccess={() => navigate({ to: ".." })}
          />
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
                <div className="flex shrink-0 gap-4">
                  <EditRoomModalButton roomId={room.id} />
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
              {!!room.images.length &&
                room.images.map(({ id, blob }) => (
                  <div className="relative" key={id}>
                    <button
                      className="absolute top-0 right-0 p-1 m-1"
                      onClick={() =>
                        deleteImage.mutateAsync({ roomImageId: id })}
                      type="button"
                      disabled={deleteImage.isPending}
                    >
                      {deleteImage.isPending &&
                          deleteImage.variables.roomImageId === id
                        ? <Spinner className="text-gray-500" />
                        : <XCircleIcon className="w-6 bg-white rounded-full" />}
                    </button>
                    <img
                      className="w-full rounded-lg aspect-1/1 object-cover"
                      src={blob.uploadthingMeta?.ufsUrl}
                      alt=""
                    />
                  </div>
                ))}
              <AddImage roomId={room.id} />
            </div>
          </Card>
        </div>

        <AvailabilityCard />
      </div>
    </>
  );
}

function AvailabilityCard() {
  const { roomId } = Route.useParams();

  const availability = useRoomAvailability(roomId);

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

  return (
    <>
      <Card>
        <div className="px-4 py-5 sm:px-6 border-b border-b-gray-200">
          <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Availability
            </h3>
            <ChangeRoomAvailabilityModalButton roomId={roomId} />
          </div>
          <div>
            {
              /* <button
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
            </button> */
            }
            {/* <pickCalendar.Modal /> */}
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
    </>
  );
}

function AddImage(props: { roomId: string }) {
  const queryClient = useQueryClient();
  const { roomId } = props;

  return (
    <div>
      <UploadDropzone
        endpoint="room_image"
        input={{ roomId: roomId }}
        config={{ cn: twMerge, mode: "auto" }}
        appearance={{ container: "mt-0 h-full", button: "hidden" }}
        content={{
          label: ({ files }) => <>Add image</>,
          uploadIcon: ({ isUploading, ready }) => (
            <div className="size-6">
              {ready && !isUploading
                ? <PhotoIcon className="text-gray-500 w-8 mx-auto" />
                : <Spinner className="text-gray-500" />}
            </div>
          ),
        }}
        onClientUploadComplete={() => {
          queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
        }}
      />
    </div>
  );
}
