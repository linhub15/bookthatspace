import { Enums, Tables, TablesInsert } from "@/src/clients/supabase";
import { SubmitButton } from "@/src/components/buttons/submit_button";
import { TimePicker } from "@/src/components/form/time_picker";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Temporal } from "@js-temporal/polyfill";
import { useForm } from "@tanstack/react-form";
import { Fragment } from "react";

type Props = {
  roomId: string;
  values: Tables<"room_availability">[];
  onSubmit: (
    availabilities: {
      action: "upsert" | "delete";
      payload: TablesInsert<"room_availability">;
    }[],
  ) => void | Promise<void>;
  onCancel: () => void;
};

type Availability = {
  enabled: boolean;
  touched: boolean;
  availabilityId?: string;
  day_of_week: Enums<"day_of_week">;
  start: Temporal.PlainTime;
  end: Temporal.PlainTime;
};

const defaultStart = Temporal.PlainTime.from({ hour: 0 });
const defaultEnd = Temporal.PlainTime.from({ hour: 23 });

export function AvailabilityForm(props: Props) {
  const { values: blocks } = props;

  const get = (weekday: Enums<"day_of_week">): Availability => {
    const found = blocks.find((block) => block.day_of_week === weekday);
    return found
      ? {
        touched: false,
        enabled: true,
        availabilityId: found.id,
        day_of_week: weekday,
        start: Temporal.PlainTime.from(found.start),
        end: Temporal.PlainTime.from(found.end),
      }
      : {
        touched: false,
        enabled: false,
        availabilityId: undefined,
        day_of_week: weekday,
        start: defaultStart,
        end: defaultEnd,
      };
  };

  const values = {
    Monday: get("mon"),
    Tuesday: get("tue"),
    Wednesday: get("wed"),
    Thursday: get("thu"),
    Friday: get("fri"),
    Saturday: get("sat"),
    Sunday: get("sun"),
  };

  const fieldNames = Object.keys(values) as [keyof typeof values];

  const form = useForm({
    defaultValues: values,
    onSubmit: async ({ value }) => {
      const output = Object.values(value)
        .filter((value) => value.touched)
        .map((value) => {
          return {
            action: value.enabled ? "upsert" : "delete",
            payload: {
              id: value.availabilityId,
              room_id: props.roomId,
              day_of_week: value.day_of_week,
              start: value.start.toJSON(),
              end: value.end.toJSON(),
            },
          } as const;
        });
      props.onSubmit(output);
    },
  });

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          void await form.handleSubmit();
        }}
      >
        <div className="space-y-3">
          {fieldNames.map((weekday, index) => (
            <Fragment key={index}>
              <form.Field
                name={weekday}
                validators={{
                  onChange: (field) => {
                    if (!field.value?.enabled) {
                      return;
                    }

                    const result = Temporal.PlainTime.compare(
                      field.value?.start,
                      field.value?.end,
                    );

                    if (result >= 0) {
                      return "Start time must be before end time";
                    }
                  },
                }}
              >
                {(field) => (
                  <div
                    className="grid grid-cols-4 min-h-12"
                    key={index}
                  >
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={field.state.value?.enabled}
                        onChange={(e) =>
                          field.handleChange((old) => ({
                            ...old,
                            touched: true,
                            enabled: e.target.checked,
                          }))}
                      />
                      <span className="text-sm font-medium leading-6 text-gray-900 select-none">
                        <span className="hidden sm:inline">{weekday}</span>
                        <span className="sm:hidden">
                          {weekday.slice(0, 3)}
                        </span>
                      </span>
                    </label>
                    {field.state.value?.enabled && (
                      <div className="flex flex-col justify-center space-y-1 col-span-2">
                        <div className="flex">
                          <TimePicker
                            value={field.state.value?.start}
                            onChange={(v) => {
                              field.handleChange((old) => ({
                                ...old,
                                touched: true,
                                start: v,
                              }));
                            }}
                          />
                          <span className="my-auto px-1">
                            <ArrowRightIcon className="w-4 h-4" />
                          </span>
                          <TimePicker
                            value={field.state.value?.end}
                            min={field.state.value?.start}
                            onChange={(v) => {
                              field.handleChange((old) => ({
                                ...old,
                                touched: true,
                                end: v,
                              }));
                            }}
                          />
                        </div>
                        <div className="text-xs text-red-900 pl-1">
                          {field.state?.meta?.errors[0] ?? ""}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </Fragment>
          ))}
        </div>

        <div className="pt-6 sm:pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <form.Subscribe>
            {(state) => (
              <>
                <SubmitButton pending={state.isSubmitting}>Save</SubmitButton>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={props.onCancel}
                  disabled={state.isSubmitting}
                >
                  Cancel
                </button>
              </>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
