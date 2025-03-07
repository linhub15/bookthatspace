import { SubmitButton } from "@/app/components/buttons/submit_button";
import { TimePicker } from "@/app/components/form/time_picker";
import { ToggleSwitch } from "@/app/components/form/toggle_switch";
import { Button } from "@/app/components/ui/button";
import type {
  DayOfWeekEnum,
  RoomAvailabilityInsert,
  RoomAvailabilitySelect,
} from "@/app/db/types";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useForm } from "@tanstack/react-form";
import { Temporal } from "temporal-polyfill";

type Props = {
  roomId: string;
  values: RoomAvailabilitySelect[];
  onSubmit: (
    availabilities: RoomAvailabilityInsert[],
  ) => void | Promise<void>;
  onCancel: () => void;
};

type Availability = {
  enabled: boolean;
  day_of_week: DayOfWeekEnum;
  intervals: Interval[];
};

type Interval = {
  id: string;
  start: Temporal.PlainTime;
  end: Temporal.PlainTime;
};

const defaultStart = Temporal.PlainTime.from({ hour: 0 });
const defaultEnd = Temporal.PlainTime.from({ hour: 23 });

export function RoomAvailabilityForm(props: Props) {
  const { values: blocks } = props;

  const get = (weekday: DayOfWeekEnum): Availability => {
    const found = blocks.filter((block) => block.dayOfWeek === weekday);
    const availability = found.reduce(
      (prev, curr) => {
        const interval = {
          id: curr.id,
          start: curr.start
            ? Temporal.PlainTime.from(curr.start)
            : Temporal.PlainTime.from("00:00:00"),
          end: curr.end
            ? Temporal.PlainTime.from(curr.end)
            : Temporal.PlainTime.from("23:59:59"),
        };
        prev.enabled = true;
        prev.intervals = [...prev.intervals, interval];
        return prev;
      },
      {
        enabled: false,
        day_of_week: weekday,
        intervals: [],
      } as Availability,
    );

    return availability;
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
        .map((value) => {
          return value.intervals.map((interval) => ({
            roomId: props.roomId,
            dayOfWeek: value.day_of_week,
            id: interval.id,
            start: interval.start.toString(),
            end: interval.end.toString(),
          }));
        });
      const flattened = output.flat();
      props.onSubmit(flattened);
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
          {fieldNames.map((weekday) => (
            <form.Field name={weekday} key={weekday}>
              {(field) => (
                <div className="grid grid-cols-4 min-h-12">
                  <label
                    className="flex items-center space-x-2 self-start pt-2"
                    htmlFor="toggle"
                  >
                    <ToggleSwitch
                      value={field.state.value.enabled}
                      onChange={(value) =>
                        field.handleChange((old) => {
                          return {
                            ...old,
                            enabled: value,
                            intervals: value
                              ? [{
                                id: self.crypto.randomUUID(),
                                start: defaultStart,
                                end: defaultEnd,
                              }]
                              : [],
                          };
                        })}
                    />
                    <span className="text-sm font-medium leading-6 text-gray-900 select-none">
                      <span className="hidden sm:inline">{weekday}</span>
                      <span className="sm:hidden">
                        {weekday.slice(0, 3)}
                      </span>
                    </span>
                  </label>
                  {field.state.value?.enabled && (
                    <div className="flex flex-col justify-center space-y-1 col-span-3">
                      {field.state.value.intervals.map((interval, index) => (
                        <div className="flex gap-2" key={interval.id}>
                          <div className="flex gap-1">
                            <TimePicker
                              value={interval.start}
                              onChange={(v) => {
                                field.handleChange((old) => ({
                                  ...old,
                                  intervals: old.intervals.toSpliced(
                                    index,
                                    1,
                                    {
                                      ...interval,
                                      start: v,
                                    },
                                  ),
                                }));
                              }}
                            />
                            <span className="my-auto">
                              <MinusIcon className="w-4 h-4" />
                            </span>
                            <TimePicker
                              value={interval.end}
                              min={interval.start}
                              onChange={(v) => {
                                field.handleChange((old) => ({
                                  ...old,
                                  intervals: old.intervals.toSpliced(
                                    index,
                                    1,
                                    {
                                      ...interval,
                                      end: v,
                                    },
                                  ),
                                }));
                              }}
                            />
                          </div>
                          {index === 0 &&
                            (
                              <Button
                                type="button"
                                variant="outline"
                                size={"icon"}
                                onClick={() =>
                                  field.handleChange((old) => ({
                                    ...old,
                                    intervals: [...old.intervals, {
                                      id: self.crypto.randomUUID(),
                                      start: defaultStart,
                                      end: defaultEnd,
                                    }],
                                  }))}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </Button>
                            )}
                          {index !== 0 &&
                            (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  field.handleChange((old) => ({
                                    ...old,
                                    intervals: old.intervals.toSpliced(
                                      index,
                                      1,
                                    ),
                                  }))}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            )}
                        </div>
                      ))}
                      <div className="hidden sm:block text-xs text-red-900 pl-1">
                        {field.state?.meta?.errors[0] ?? ""}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form.Field>
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
