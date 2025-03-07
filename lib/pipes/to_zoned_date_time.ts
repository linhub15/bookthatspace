import { Temporal } from "temporal-polyfill";

export function toZonedDateTime(
  plainDate?: Temporal.PlainDate,
  time?: Temporal.PlainTime,
  timeZoneId?: string,
) {
  return Temporal.PlainDateTime.from({
    day: plainDate?.day,
    month: plainDate?.month,
    year: plainDate?.year,
    hour: time?.hour,
    minute: time?.minute,
  }).toZonedDateTime(timeZoneId ?? Temporal.Now.timeZoneId());
}
