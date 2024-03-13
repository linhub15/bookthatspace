import { Card } from "@/src/components/card";
import { DatePicker } from "@/src/components/form/date_picker";
import { Label } from "@/src/components/form/label";
import { useForm } from "@tanstack/react-form";
import { RoomPicker } from "./room_picker";
import { confirmationRoute, publicBookingRoutes } from "./public.routes";
import { useCreateBooking } from "./hooks";
import { Temporal } from "@js-temporal/polyfill";
import { Link, useNavigate } from "@tanstack/react-router";
import { TimePicker } from "@/src/components/form/time_picker";
import { SubmitButton } from "@/src/components/buttons/submit_button";

type Form = {
  date: Temporal.PlainDate | undefined;
  room: string | undefined;
  start: Temporal.PlainTime | undefined;
  end: Temporal.PlainTime | undefined;
  name: string;
  email: string;
  description: string;
};

export function BookingWidget() {
  const { facility_id } = publicBookingRoutes.useParams();
  const mutation = useCreateBooking();
  const navigate = useNavigate();

  const form = useForm<Form>({
    defaultValues: {
      date: Temporal.Now.plainDateISO(),
      room: undefined,
      start: Temporal.PlainTime.from("00:00"),
      end: undefined,
      name: "",
      email: "",
      description: "",
    },
    onSubmit: async (form) => {
      await mutation.mutateAsync({
        date: form.value.date!,
        roomId: form.value.room!,
        start: form.value.start!,
        end: form.value.end!,
        name: form.value.name,
        email: form.value.email,
        description: form.value.description,
      }, {
        onSuccess: async (data) => {
          if (!data) return;
          await navigate({
            to: confirmationRoute.to,
            params: { facility_id: facility_id },
            search: { booking_id: data.id },
          });
        },
      });
    },
  });

  return (
    <div className="flex gap-4 max-w-screen-lg w-full px-2 sm:mx-auto pt-8">
      <Card>
        <form
          className="space-y-8 px-4 py-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="room">
            {(field) => (
              <div className="space-y-2">
                <div className="space-x-4">
                  <Label htmlFor={field.name}>Choose a room</Label>
                  <Link
                    className="text-xs leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                    to="/widget/$facility_id"
                    params={{ facility_id: facility_id }}
                  >
                    View room details
                  </Link>
                </div>
                <RoomPicker
                  name={field.name}
                  id={field.name}
                  facilityId={facility_id}
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
                  <TimePicker
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="end">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>End</Label>
                  <form.Subscribe>
                    {(state) => (
                      <TimePicker
                        value={field.state.value}
                        min={state.values.start}
                        onChange={(v) => field.handleChange(v)}
                      />
                    )}
                  </form.Subscribe>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
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

          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
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
          <div className="pt-10 max-w-sm mx-auto">
            <form.Subscribe>
              {(state) => (
                <SubmitButton pending={state.isSubmitting}>
                  Submit Booking Request
                </SubmitButton>
              )}
            </form.Subscribe>
          </div>
          <p className="pt-2 text-center text-xs text-gray-500">
            Payment not required until booking is accepted
          </p>
        </form>
      </Card>
    </div>
  );
}
