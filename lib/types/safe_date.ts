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

export const asPlainDate = (date: string): Temporal.PlainDate => {
  const parsed = zPlainDateString.parse(date);
  return Temporal.PlainDate.from(parsed);
};

export const asPlainTime = (date: DateLike): Temporal.PlainTime => {
  const parsed = zSafeDate.parse(date);
  return Temporal.PlainTime.from(parsed.toISOString());
};
