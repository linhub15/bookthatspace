import { Temporal } from "temporal-polyfill";
import { useEffect, useId, useMemo } from "react";

/** Minutes between 0 and 60 exclusive */
const INTERVAL = 30;

type Props = {
  value: Temporal.PlainTime | undefined;
  min?: Temporal.PlainTime | undefined;
  onChange: (value: Temporal.PlainTime) => void;
};

export function TimePicker(props: Props) {
  const id = useId();
  const timeOptions = useMemo(() =>
    [...Array(24).keys()]
      .flatMap((hour) => {
        const hourStart = Temporal.PlainTime.from({ hour: hour });
        const hourHalf = hourStart.add({ minutes: INTERVAL });
        return [
          hourStart,
          hourHalf,
        ];
      })
      .toSpliced(
        Number.POSITIVE_INFINITY,
        0,
        Temporal.PlainTime.from({ hour: 23, minute: 59 }),
      )
      .filter((time) => isValid({ time, min: props.min })), [props.min]);

  // this is ugly, but used to update the time when min changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!props.min || !props.value) return; // prevent infinite loop
    if (isValid({ time: props.value, min: props.min })) return;
    const optionIdx = timeOptions.findIndex((o) => o.equals(props.min!)) + 1;
    props.onChange(timeOptions.at(optionIdx) || props.min);
  }, [props.min]);

  return (
    <select
      className="block rounded-md border-0 py-1.5 pr-8 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-60 text-sm sm:leading-6"
      value={props.value?.toJSON()}
      onChange={(e) => {
        const plainTime = Temporal.PlainTime.from(
          e.currentTarget.value,
        );
        props.onChange(plainTime);
      }}
    >
      {timeOptions.map((time) => (
        <option value={time.toJSON()} key={`${id}-${time.toJSON()}`}>
          {maskTimeOption(time)}
        </option>
      ))}
    </select>
  );
}

/** Temporal .toLocaleString() is really slow >400ms, so we do this manually. */
const maskTimeOption = (time: Temporal.PlainTime) => {
  return `${time.hour.toString().padStart(2, "0")}:${
    time.minute.toString().padStart(2, "0")
  }`;
};

/** Time follows the constraints of min, without overlapping */
function isValid(
  args: { time: Temporal.PlainTime; min?: Temporal.PlainTime },
) {
  if (!args.min) return true; // No min constraint, so time is always valid
  // https://tc39.es/proposal-temporal/docs/plaintime.html#static-method
  // -1 means min is earlier than time -> valid
  // 0 means min is same as time -> invalid
  // 1 means min is later than time -> invalid
  return Temporal.PlainTime.compare(args.min, args.time) === -1;
}
