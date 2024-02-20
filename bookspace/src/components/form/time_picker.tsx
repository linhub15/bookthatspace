import { Temporal } from "@js-temporal/polyfill";
import { ComponentProps, memo } from "react";

const options: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h23",
};

type Props = {
  value: Temporal.PlainTime | undefined;
  onChange: (value: Temporal.PlainTime) => void;
} & Omit<ComponentProps<"select">, "value" | "onChange">;

export function TimePicker(props: Props) {
  return (
    <select
      {...props}
      className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={props.value?.toJSON()}
      onChange={(e) => {
        const plainTime = Temporal.PlainTime.from(
          e.currentTarget.value,
        );
        props.onChange(plainTime);
      }}
    >
      <TimeOptionsMemo />
    </select>
  );
}

const TimeOptionsMemo = memo(function TimeOptions() {
  const timeOptions = [...Array(24).keys()].map((hour) => {
    const hourStart = Temporal.PlainTime.from({ hour: hour });
    const hourHalf = hourStart.add({ minutes: 30 });

    const times = [
      hourStart.toJSON(),
      hourHalf.toJSON(),
    ];

    return times;
  }).flat();

  const maskTimeOption = (time: string) => {
    return Temporal.PlainTime.from(time).toLocaleString(undefined, options);
  };

  const optionLabels = new Map(
    timeOptions.map((option) => [option, maskTimeOption(option)]),
  );

  return timeOptions.map((time, index) => (
    <option value={time} key={index}>
      {optionLabels.get(time)}
    </option>
  ));
});
