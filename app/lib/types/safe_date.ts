import { Temporal } from "temporal-polyfill";
import { z } from "zod";

const zDateLike = z.union([z.number(), z.string(), z.date()]);
type DateLike = z.infer<typeof zDateLike>;
export const zSafeDate = zDateLike.pipe(z.coerce.date());

export const zPlainDateString = z.custom<string>((value) => {
  return typeof value === "string"
    ? Temporal.PlainDate.from(value).toString() === value
    : false;
});

export const asPlainDate = (utcDate: string): Temporal.PlainDate => {
  return Temporal.Instant.from(utcDate).toZonedDateTime({
    calendar: "iso8601",
    timeZone: Temporal.Now.timeZoneId(),
  }).toPlainDate();
};

export const asPlainTime = (date: DateLike): Temporal.PlainTime => {
  const parsed = zSafeDate.parse(date);
  return Temporal.PlainTime.from(parsed.toISOString());
};
