import { useForm } from "@tanstack/react-form";
import { useRoom, useUpdateRoom as useUpsertRoom } from "./hooks";
import { Label } from "@/src/components/form/label";
import { FormField } from "@/src/components/form/form_field";
import { UserIcon } from "@heroicons/react/24/outline";
import { useFacility } from "../../hooks";

type Props = {
  roomId?: string;
  submitBtnText: string;
  onAfterSubmit: (roomId: string) => void;
  onCancel: () => void;
};

export function RoomForm(props: Props) {
  const { data: facility } = useFacility();
  const { data: room } = useRoom(props.roomId);
  const upsertRoom = useUpsertRoom();

  const form = useForm({
    defaultValues: {
      name: room?.name,
      address: room?.address ?? undefined,
      description: room?.description ?? undefined,
      max_capacity: room?.max_capacity?.toString() ?? undefined,
      hourly_rate: room?.hourly_rate?.toString() ?? undefined,
    },
    onSubmit: async (form) => {
      if (!facility) {
        throw new Error("Facility is required to upsert room");
      }

      await upsertRoom.mutateAsync({
        room: {
          id: props.roomId,
          facility_id: facility.id,
          name: form.value.name ?? "",
          address: form.value.address,
          description: form.value.description,
          max_capacity: Number(form.value.max_capacity) ?? null,
          hourly_rate: Number(form.value.hourly_rate) ?? null,
        },
      }, {
        onSuccess: (data) => {
          if (!data?.id) return;
          props.onAfterSubmit(data.id);
        },
      });
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
              <FormField>
                <Label htmlFor={field.name}>Room name</Label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <FormField>
                <Label htmlFor={field.name}>Address</Label>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="hourly_rate">
              {(field) => (
                <FormField>
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
                        / hr
                      </span>
                    </div>
                  </div>
                </FormField>
              )}
            </form.Field>

            <form.Field name="max_capacity">
              {(field) => (
                <FormField>
                  <Label htmlFor={field.name}>Maximum Capacity</Label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                      <span className="text-gray-500">
                        <UserIcon className="inline w-4 stroke-2" />
                      </span>
                    </div>
                    <input
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </FormField>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <FormField>
                <Label htmlFor={field.name}>Description</Label>
                <textarea
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  name={field.name}
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )}
          </form.Field>
        </div>

        <div className="pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            type="submit"
          >
            {props.submitBtnText ?? "Save"}
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
