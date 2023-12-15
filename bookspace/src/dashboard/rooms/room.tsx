import { Link, useNavigate } from "@tanstack/react-router";
import { useDeleteRoom, useRoomAvailability, useRooms } from "./hooks";
import { BackButton } from "@/src/components/buttons/back_button";
import { Card } from "@/src/components/card";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { maskHourlyRate } from "@/src/masks/masks";
import { Temporal } from "@js-temporal/polyfill";
import { useWeekCalendar } from "./use_week_calendar";
import { Modal } from "@/src/components/modal";
import { useState } from "react";
import { AvailabilityForm } from "./availability_form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/supabase";
import { TablesInsert } from "@/src/types/supabase_types";

type Props = {
  roomId: string;
};

export function Room(props: Props) {
  const navigate = useNavigate();

  const rooms = useRooms();
  const room = rooms.data?.find((room) => room.id === props.roomId);
  const deleteRoom = useDeleteRoom();
  const availability = useRoomAvailability(props.roomId);

  const calendar = useWeekCalendar();

  const changeAvailability = useChangeAvailability({ roomId: props.roomId });

  const [open, setOpen] = useState(false);

  if (!room) return <div>loading...</div>;

  const onDelete = async () => {
    await deleteRoom.mutateAsync(room.id, {
      onSuccess: () => navigate({ to: "/dashboard/rooms" }),
    });
  };

  return (
    <>
      <div className="space-y-4">
        <Link className="w-fit" to="/dashboard/rooms">
          <BackButton />
        </Link>

        <Card>
          <div className="bg-white px-4 py-5 sm:px-6">
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
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilSquareIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="relativeinline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-800 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 pb-8 sm:px-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Cost
                </dt>
                <dd className="leading-6 text-gray-700">
                  {maskHourlyRate(room.hourly_cost)}
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
                  About
                </dt>
                <dd className="leading-6 text-gray-700">
                  {room.description}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="bg-white px-4 py-5 sm:px-6 border-b border-b-gray-200">
            <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Availability
              </h3>
              <div className="flex flex-shrink-0 gap-4">
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => setOpen(true)}
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
          <calendar.WeekView>
            {availability.data && (
              availability.data?.map((a, index) => (
                <calendar.Event
                  key={index}
                  weekday={a.day_of_week}
                  start={Temporal.PlainTime.from(a.start)}
                  end={Temporal.PlainTime.from(a.end)}
                />
              ))
            )}
          </calendar.WeekView>
        </Card>
      </div>
      <Modal open={open} onDismiss={() => {}}>
        <div className="pb-8">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Change Availability
          </h3>
          <p className="text-sm text-gray-500">
            {room.name}
          </p>
        </div>
        <AvailabilityForm
          roomId={props.roomId}
          values={availability.data || []}
          onSubmit={async (value) => {
            await changeAvailability.mutateAsync(value, {
              onSuccess: () => setOpen(false),
            });
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}

function useChangeAvailability(args: { roomId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (
      availabilities: {
        action: "upsert" | "delete";
        payload: TablesInsert<"room_availability">;
      }[],
    ) => {
      const toDelete = availabilities
        .filter((a) => a.action === "delete" && a.payload.id)
        .map((a) => a.payload.id);
      const toInsert = availabilities
        .filter((a) => a.action === "upsert" && !a.payload.id)
        .map((a) => {
          delete a.payload.id;
          return a.payload;
        });
      const toUpdate = availabilities
        .filter((a) => a.action === "upsert" && a.payload.id)
        .map((a) => a.payload);

      const errors = [];

      if (toUpdate.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .upsert([...toUpdate])
          .eq("room_id", args.roomId);

        !!error && errors.push(error);
      }

      if (toInsert.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .insert([...toInsert]);

        !!error && errors.push(error);
      }

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .delete()
          .in("id", toDelete);

        !!error && errors.push(error);
      }

      if (errors.length > 0) {
        console.log(errors);
        alert("Error updating availability");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "availability", args.roomId],
      });
    },
  });

  return mutation;
}
