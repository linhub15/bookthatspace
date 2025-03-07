import { useForm } from "@tanstack/react-form";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/app/components/form/form_field";
import { Label } from "@/app/components/form/label";
import { useRejectBooking } from "./hooks/use_reject_booking";

export function RejectBookingForm(
  props: { bookingId: string; onAfterSubmit: () => void; onCancel: () => void },
) {
  const mutation = useRejectBooking();
  const form = useForm({
    defaultValues: { reason: "" },
    onSubmit: async (form) => {
      await mutation.mutateAsync({
        bookingId: props.bookingId,
        reason: form.value.reason,
      }, {
        onSuccess: () => props.onAfterSubmit(),
      });
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await form.handleSubmit();
  };
  return (
    <form onSubmit={submit}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Reject booking
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              You may specify a reason for rejecting the booking.
            </p>
          </div>
          <form.Field name="reason">
            {(field) => (
              <FormField>
                <Label htmlFor={field.name}>Reason</Label>
                <textarea
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  rows={3}
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          </form.Field>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <form.Subscribe>
          {(state) => (
            <button
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              type="submit"
              disabled={state.isSubmitting}
            >
              {!state.values.reason ? "Reject" : "Reject with reason"}
            </button>
          )}
        </form.Subscribe>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={props.onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
