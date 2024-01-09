import { Modal } from "../../../components/modal";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useAddRoom, useRooms } from "./hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { Tables } from "../../../types/supabase_types";
import { maskHourlyRate } from "../../../masks/masks";
import { Card } from "@/src/components/card";
import { Label } from "@/src/components/form/label";
import { roomRoute } from "../dashboard.routes";

export function Rooms() {
  const [open, setOpen] = useState(false);
  const rooms = useRooms();
  const navigate = useNavigate();

  const openNewRoomForm = () => {
    setOpen(true);
  };

  const onRoomCreated = (roomId: string) => {
    setOpen(false);
    navigate({ to: roomRoute.to, params: { room_id: roomId } });
  };

  return (
    <Card>
      <div className="px-4 py-6 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Rooms
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Rooms and halls available for booking.
          </p>
        </div>
        <div>
          <button
            className="bg-blue-600 rounded text-white py-2 px-4 w-fit"
            onClick={openNewRoomForm}
            disabled={rooms.isLoading}
          >
            Add Room
          </button>
        </div>
      </div>
      <div className="px-4 py-6 sm:px-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.data?.map((room, index) => (
            <RoomCard
              key={index}
              room={room}
            />
          ))}
        </dl>

        <Modal
          open={open}
          onDismiss={() => {}}
        >
          <NewRoomForm
            onCancel={() => setOpen(false)}
            onAfterSubmit={(id) => onRoomCreated(id)}
          />
        </Modal>
      </div>
    </Card>
  );
}

function RoomCard(props: { room: Tables<"room"> }) {
  return (
    <Link to={roomRoute.to} params={{ room_id: props.room.id }}>
      <div className="rounded-lg shadow-sm ring-1 ring-gray-900/5 select-none">
        <div className="flex w-full px-6 py-6 justify-between align-top">
          <div className="flex-auto">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              {props.room.name}
            </dt>
            <dd className="mt-1 text-base text-gray-500">
              {maskHourlyRate(props.room.hourly_rate)}
            </dd>
          </div>
          <div className="flex-none">
            <dt className="sr-only">Status</dt>
            <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Active
            </dd>
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewRoomForm(
  props: { onCancel: () => void; onAfterSubmit: (roomId: string) => void },
) {
  const addRoom = useAddRoom();

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      max_capacity: "",
      hourly_rate: "",
    },
    onSubmit: async (values) => {
      await addRoom.mutateAsync(
        {
          name: values.value.name,
          address: values.value.address,
          description: values.value.description,
          max_capacity: Number(values.value.max_capacity) ?? null,
          hourly_rate: Number(values.value.hourly_rate) ?? null,
        },
        {
          onSuccess: (data) => {
            if (!data?.id) return;
            props.onAfterSubmit(data.id);
          },
        },
      );
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await form.handleSubmit();
  };

  return (
    <form.Provider>
      <form onSubmit={submit}>
        <div className="space-y-6">
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Room name{" "}
                  <span className="text-xs font-normal text-gray-500">
                    (Required)
                  </span>
                </Label>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Address</Label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="max_capacity">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Capacity</Label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="hourly_rate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Hourly Rate</Label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name={field.name}
                    id={field.name}
                    placeholder="0.00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-describedby="price-currency"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="price-currency"
                    >
                      CAD
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <textarea
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          >
            Create Room
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </form.Provider>
  );
}
