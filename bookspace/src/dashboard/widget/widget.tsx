import { PropsWithChildren, useState } from "react";
import { Calendar } from "../../components/calendar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { DurationSlider } from "../../components/duration_slider";
import { Temporal } from "@js-temporal/polyfill";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Tables } from "../../types/supabase_types";
import { maskHourlyRate, maskTime } from "../../masks/masks";

const timeOptions = Array.from(Array(24 * 2), (_, i) => {
  return Temporal.PlainTime.from({
    hour: Math.floor(i / 2),
    minute: (i % 2) * 30,
  });
});

function useCreateBooking() {
  const mutation = useMutation({
    // todo(hubert): limit the ability to update status (RLS)
    mutationFn: async (
      args: {
        roomId: string;
        date: Temporal.PlainDate;
        start: Temporal.PlainTime;
        duration: Temporal.Duration;
      },
    ) => {
      const start = Temporal.PlainDateTime.from({
        day: args.date.day,
        month: args.date.month,
        year: args.date.year,
        hour: args.start.hour,
        minute: args.start.minute,
      }).toZonedDateTime(Temporal.Now.timeZoneId());

      const end = start.add(args.duration);

      await supabase.from("room_booking").insert({
        start: start.toString({ timeZoneName: "never" }),
        end: end.toString({ timeZoneName: "never" }),
        room_id: args.roomId,
        booked_by_email: "ddd",
      });
    },
  });
  return mutation;
}

export function Widget(props: { profileId?: string }) {
  const rooms = useQuery({
    queryKey: ["rooms", props.profileId],
    queryFn: async () => {
      const { data, error } = await supabase.from("room").select().eq(
        "profile_id",
        props.profileId!,
      );

      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
    enabled: !!props.profileId,
  });
  const [selectedRoom, setSelectedRoom] = useState<Tables<"room">>();
  const [selectedDay, setSelectedDay] = useState<Temporal.PlainDate>();

  const [selectedDuration, setSelectedDuration] = useState<Temporal.Duration>(
    Temporal.Duration.from({ minutes: 60 }),
  );

  const availableTimes: Temporal.PlainTime[] = timeOptions;
  const [selectedTime, setSelectedTime] = useState<Temporal.PlainTime>();

  const selectDay = (day?: Date) => {
    if (!day) return;
    setSelectedDay(Temporal.PlainDate.from(day.toLocaleDateString()));
  };

  return (
    <div className="flex gap-4 max-w-screen-lg">
      <div id="steps" className="w-full">
        {rooms.data && !selectedRoom && (
          <Step heading="Select a room">
            <RoomPicker
              options={rooms.data}
              value={selectedRoom!}
              onChange={setSelectedRoom}
            />
          </Step>
        )}
        {selectedRoom && !selectedDay && (
          <Step
            heading="Select Day"
            onBack={() => setSelectedRoom(undefined)}
          >
            <Calendar
              mode="single"
              showOutsideDays={false}
              selected={selectedDay}
              onSelect={selectDay}
            />
          </Step>
        )}
        {selectedDay && (
          <Step
            heading="Start time & Duration"
            onBack={() => {
              setSelectedDay(undefined);
              setSelectedTime(undefined);
            }}
          >
            <div className="max-h-48 overflow-y-scroll px-6">
              <TimePicker
                options={availableTimes}
                value={selectedTime}
                onChange={setSelectedTime}
                duration={selectedDuration}
              />
            </div>
            <div className="py-4">
              <span>Duration</span>
              <Duration
                value={selectedDuration}
                onChange={setSelectedDuration}
              />
            </div>
          </Step>
        )}
      </div>
      {selectedRoom && (
        <Summary
          selectedRoom={selectedRoom}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          selectedDuration={selectedDuration}
        />
      )}
    </div>
  );
}

type RoomPickerProps = {
  options: Tables<"room">[];
  value: Tables<"room">;
  onChange: (value: Tables<"room">) => void;
};

function RoomPicker(props: RoomPickerProps) {
  const rooms = props.options;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {rooms?.map((room) => (
        <div key={room.id} className="group relative">
          <div className="w-full overflow-hidden rounded-xl bg-gray-200 group-hover:opacity-75">
            <img
              src="https://placehold.co/400"
              alt="placeholder"
              className="h-full w-full max-h-52 lg:max-h-72 object-cover object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-2 p-4">
            <h3 className="text-sm font-medium text-gray-900">
              <button onClick={() => props.onChange(room)}>
                <span aria-hidden="true" className="absolute inset-0" />
                {room.name}
              </button>
            </h3>
            <p className="text-sm text-gray-500">{room.description}</p>
            <div className="flex flex-1 flex-col justify-end">
              <p className="text-sm italic text-gray-500">
                Max {room.max_capacity} people
              </p>
              <p className="text-base font-medium text-gray-900">
                {maskHourlyRate(room.hourly_cost)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

type TimePickerProps = {
  options: Temporal.PlainTime[];
  value: Temporal.PlainTime | undefined;
  duration: Temporal.Duration;
  onChange: (value: Temporal.PlainTime | undefined) => void;
};

function TimePicker(props: TimePickerProps) {
  const isSelected = (time: Temporal.PlainTime) => {
    return props.value?.equals(time);
  };

  const toggleTimeSelection = (time: Temporal.PlainTime) => {
    props.onChange(time);
  };

  return (
    <div className="flex flex-col gap-2">
      {props.options.map((time) => (
        <button
          key={time.toString()}
          className={`px-4 py-2 w-48 rounded border border-indigo-600 text-center
           ${
            isSelected(time) ? "bg-indigo-600 text-white" : "text-indigo-600"
          }`}
          type="button"
          onClick={() => toggleTimeSelection(time)}
        >
          <span>
            {maskTime(time)}
          </span>
        </button>
      ))}
    </div>
  );
}

type DurationProps = {
  value: Temporal.Duration;
  onChange: (value: Temporal.Duration) => void;
};

function Duration(props: DurationProps) {
  const duration = props.value.minutes;
  return (
    <div className="flex flex-col px-4">
      <DurationSlider
        value={duration}
        onChange={(v) => props.onChange(Temporal.Duration.from({ minutes: v }))}
      />
      <div className="py-4 text-lg text-gray-600">
        {maskDuration(duration)}
      </div>
    </div>
  );
}

function maskDuration(value: Minutes) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours} hr ${minutes ? `${minutes} min` : ""}`;
}

function Step(
  props: { heading: string; onBack?: () => void } & PropsWithChildren,
) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="flex gap-6 px-4 py-5 sm:px-6 items-center">
        {props.onBack && (
          <button
            type="button"
            onClick={props.onBack}
            className="rounded-md inline-flex bg-white px-2.5 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ChevronLeftIcon
              className="-ml-0.5 h-5 w-5"
              aria-hidden="true"
            />
            Back
          </button>
        )}
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {props.heading}
        </h3>
      </div>
      <div className="px-4 py-5 sm:px-6">
        {props.children}
      </div>
    </div>
  );
}

function Summary(
  { selectedRoom, selectedDay, selectedTime, selectedDuration }: {
    selectedRoom: Tables<"room">;
    selectedDay?: Temporal.PlainDate;
    selectedTime?: Temporal.PlainTime;
    selectedDuration?: Temporal.Duration;
  },
) {
  const createBooking = useCreateBooking();

  const cost = ((selectedDuration?.minutes ?? 1) / 60 *
    (selectedRoom.hourly_cost ?? 0)).toFixed(2);

  const canSubmit = selectedRoom && selectedDay && selectedTime &&
    selectedDuration;

  return (
    <div className="bg-white shadow sm:rounded-lg max-w-sm w-full">
      <div className="flex flex-col content-between h-full">
        <div className="h-full">
          <div className="">
            <div className="flex w-full px-4 sm:px-6 py-4 justify-between align-top">
              <div className="flex-auto">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  {selectedRoom.name}
                </dt>
                <dd className="mt-1 text-base text-gray-500">
                  {maskHourlyRate(selectedRoom.hourly_cost)}
                </dd>
              </div>
            </div>
          </div>
          {selectedDay && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              {selectedDay?.toLocaleString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
          {selectedTime && selectedDuration && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              {maskTime(selectedTime)} -{" "}
              {maskTime(selectedTime?.add(selectedDuration))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          {selectedDuration && selectedRoom && (
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="text-base font-medium">Estimated Total</div>
              {canSubmit && (
                <div className="text-base font-medium text-gray-900">
                  ${cost}
                </div>
              )}
            </div>
          )}
          <button
            className={`w-full px-4 py-2 rounded text-center
              ${
              canSubmit
                ? "text-white bg-indigo-600"
                : "text-gray-600 bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!canSubmit}
            onClick={() =>
              createBooking.mutateAsync({
                roomId: selectedRoom.id,
                date: selectedDay!,
                start: selectedTime!,
                duration: selectedDuration!,
              })}
          >
            Reserve your booking
          </button>
          <p className="pt-2 text-center text-xs text-gray-500">
            Payment not required until booking is accepted
          </p>
        </div>
      </div>
    </div>
  );
}
