import { SubmitButton } from "@/components/buttons/submit_button";
import { Card } from "@/components/card";
import { DatePicker } from "@/components/form/date_picker";
import { TimePicker } from "@/components/form/time_picker";
import { RoomPicker } from "@/features/public/room_picker";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Temporal } from "temporal-polyfill";
import { Route as publicFacilityRoute } from "./index";
import { Route as confirmationRoute } from "../booking-success.$bookingId";
import { useCreateBookingPublic } from "@/features/public/hooks/use_create_booking.public";
import { Label } from "@/components/form/label";
import { toZonedDateTime } from "@/lib/pipes/to_zoned_date_time";

type Form = {
  date: Temporal.PlainDate | undefined;
  roomId: string;
  start: Temporal.PlainTime | undefined;
  end: Temporal.PlainTime | undefined;
  name: string;
  email: string;
  description: string;
};

export const Route = createFileRoute("/@/$facilityId/book")({
  component: RouteComponent,
});

function RouteComponent() {
  const { facilityId } = Route.useParams();
  const navigate = useNavigate();
  const mutation = useCreateBookingPublic();

  const form = useForm({
    defaultValues: {
      date: Temporal.Now.plainDateISO(),
      roomId: "",
      start: Temporal.PlainTime.from("00:00"),
      end: undefined,
      name: "",
      email: "",
      description: "",
    } as Form,
    onSubmit: async ({ value }) => {
      const start = toZonedDateTime(value.date, value.start)
        .toString({ timeZoneName: "never" });

      const end = toZonedDateTime(value.date, value.end)
        .toString({ timeZoneName: "never" });

      return await mutation.mutateAsync({
        roomId: value.roomId,
        start: start,
        end: end,
        bookedByName: value.name,
        bookedByEmail: value.email,
        description: value.description,
      }, {
        onSuccess: async (data) => {
          if (!data) return;
          await navigate({
            to: confirmationRoute.to,
            params: { bookingId: data.id },
          });
        },
      });
    },
  });

  return (
    <div className="flex gap-4 max-w-(--breakpoint-lg) w-full px-2 sm:mx-auto pt-8">
      <Card>
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
                  <Link
                    className="text-xs leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                    to={publicFacilityRoute.to}
                    params={{ facilityId: facilityId }}
                  >
                    View room details
                  </Link>
                </div>
                <RoomPicker
                  name={field.name}
                  id={field.name}
                  facilityId={facilityId}
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
