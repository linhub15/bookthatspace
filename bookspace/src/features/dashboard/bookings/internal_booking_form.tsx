import { useForm } from "@tanstack/react-form";
import { useCreateBooking } from "./hooks";
import { Temporal } from "@js-temporal/polyfill";
import { Label } from "@/src/components/form/label";
import { RoomPicker } from "../../anon_booking/room_picker";
import { DatePicker } from "@/src/components/form/date_picker";

type Props = {
  facilityId: string;
  userName: string;
  userEmail: string;
  onAfterSubmit: () => void;
  onCancel: () => void;
};

type Form = {
  date: Temporal.PlainDate | undefined;
  roomId: string | undefined;
  start: string | undefined;
  end: string | undefined;
  description: string;
};

export function InternalBookingForm(props: Props) {
  const createBooking = useCreateBooking();
  const form = useForm<Form>({
    defaultValues: {
      roomId: undefined,
      date: Temporal.Now.plainDateISO(),
      start: "",
      end: "",
      description: "",
    },
    onSubmit: async (form) => {
      await createBooking.mutateAsync({
        roomId: form.value.roomId!,
        name: props.userName,
        email: props.userEmail,
        date: form.value.date!,
        start: Temporal.PlainTime.from(form.value.start!),
        end: Temporal.PlainTime.from(form.value.end!),
        description: form.value.description,
      }, { onSuccess: props.onAfterSubmit });
    },
  });
  return (
    <form.Provider>
      <form
        className="space-y-8 px-4 py-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="roomId">
          {(field) => (
            <div className="space-y-2">
              <div className="space-x-4">
                <Label htmlFor={field.name}>Choose a room</Label>
              </div>
              <RoomPicker
                name={field.name}
                id={field.name}
                facilityId={props.facilityId}
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
              />
            </div>
          )}
        </form.Field>

        <div className="flex space-x-4">
          <form.Field name="date">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Date</Label>
                <DatePicker
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="start">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Start</Label>
                <input
                  className="block w-full max-w-28 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="time"
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="end">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>End</Label>
                <input
                  className="block w-full max-w-28 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="time"
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Additional Information</Label>
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

        <div className="pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            type="submit"
          >
            Create Booking
          </button>
          <button
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            type="button"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </form.Provider>
  );
}