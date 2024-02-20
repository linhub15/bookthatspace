import { Enums, Tables, TablesInsert } from "@/src/clients/supabase";
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
  start: string;
  end: string;
};

const midnight = Temporal.PlainTime.from({ hour: 0 }).toJSON();
const oneOClock = Temporal.PlainTime.from({ hour: 1 }).toJSON();

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
        start: found.start,
        end: found.end,
      }
      : {
        touched: false,
        enabled: false,
        availabilityId: undefined,
        day_of_week: weekday,
        start: midnight,
        end: oneOClock,
      };
  };

  const values = {
    Mon: get("mon"),
    Tue: get("tue"),
    Wed: get("wed"),
    Thu: get("thu"),
    Fri: get("fri"),
    Sat: get("sat"),
    Sun: get("sun"),
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
              start: value.start,
              end: value.end,
            },
          } as const;
        });
      props.onSubmit(output);
    },
  });

  return (
    <div>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="">
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
                        Temporal.PlainTime.from(field.value?.start),
                        Temporal.PlainTime.from(field.value?.end),
                      );

                      if (result >= 0) {
                        return "Start time must be before end time";
                      }
                    },
                  }}
                >
                  {(field) => (
                    <div className="relative pb-4 mb-3">
                      <div
                        className="flex justify-between"
                        key={index}
                      >
                        <label className="flex py-1.5 pr-2 w-20 items-center gap-4">
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
                            {weekday}
                          </span>
                        </label>
                        <div className="min-w-[200px] w-0">
                          {field.state.value?.enabled && (
                            <div className="flex">
                              <TimePicker
                                value={Temporal.PlainTime.from(
                                  field.state.value?.start,
                                )}
                                onChange={(v) => {
                                  field.handleChange((old) => ({
                                    ...old,
                                    touched: true,
                                    start: v.toJSON(),
                                  }));
                                }}
                              />

                              <span className="my-auto px-1">
                                <ArrowRightIcon className="w-4 h-4" />
                              </span>
                              <TimePicker
                                value={Temporal.PlainTime.from(
                                  field.state.value?.end,
                                )}
                                onChange={(v) => {
                                  field.handleChange((old) => ({
                                    ...old,
                                    touched: true,
                                    end: v.toJSON(),
                                  }));
                                }}
                              />
                            </div>
                          )}
                          {!field.state.value?.enabled && (
                            <div className="py-1.5 w-full text-center text-gray-500">
                              No availability
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="absolute bottom-0 w-full text-xs text-red-900 text-right">
                        {field.state?.meta?.errors[0] ?? ""}
                      </p>
                    </div>
                  )}
                </form.Field>
              </Fragment>
            ))}
          </div>

          <div className="pt-6 sm:pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            >
              Save
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
    </div>
  );
}
