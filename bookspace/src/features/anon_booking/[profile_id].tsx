import { Card } from "@/src/components/card";
import { DatePicker } from "@/src/components/form/date_picker";
import { Label } from "@/src/components/form/label";
import { useForm } from "@tanstack/react-form";
import { RoomPicker } from "./room_picker";
import { anonBookingRoutes } from "./anon_booking.routes";
import { useCreateBooking } from "./hooks";
import { Temporal } from "@js-temporal/polyfill";
import { useNavigate } from "@tanstack/react-router";

type Form = {
  date: Date | undefined;
  room: string | undefined;
  start: string | undefined;
  end: string | undefined;
  name: string;
  email: string;
  description: string;
};

export function AnonBookingWidget() {
  const { profile_id } = anonBookingRoutes.useParams();
  const mutation = useCreateBooking();
  const navigate = useNavigate();

  const form = useForm<Form>({
    defaultValues: {
      date: new Date(),
      room: undefined,
      start: undefined,
      end: undefined,
      name: "",
      email: "",
      description: "",
    },
    onSubmit: (form) => {
      // todo: redirect to success page, send email to confirm. This does lots of things
      mutation.mutateAsync({
        date: Temporal.PlainDate.from(form.value.date!.toLocaleDateString()),
        roomId: form.value.room!,
        start: Temporal.PlainTime.from(form.value.start!),
        end: Temporal.PlainTime.from(form.value.end!),
        name: form.value.name,
        email: form.value.email,
        description: form.value.description,
      }, {
        onSuccess: async (data) => {
          if (!data) return;
          await navigate({
            to: "/s/$profile_id/confirmation",
            params: { profile_id: profile_id },
            search: { booking_id: data.id },
          });
        },
      });
    },
  });

  return (
    <div className="flex gap-4 max-w-screen-lg w-full px-2 sm:mx-auto pt-8">
      <Card>
        <form.Provider>
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
                    <a
                      className="text-xs leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                      href="#"
                    >
                      Browse room details
                    </a>
                  </div>
                  <RoomPicker
                    name={field.name}
                    id={field.name}
                    profileId={profile_id}
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
            <div className="pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              >
                Save
              </button>
            </div>
            <p className="pt-2 text-center text-xs text-gray-500">
              Payment not required until booking is accepted
            </p>
          </form>
        </form.Provider>
      </Card>
    </div>
  );
}
