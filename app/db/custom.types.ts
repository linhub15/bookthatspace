import { customType } from "drizzle-orm/pg-core";
import { Temporal } from "temporal-polyfill";

export const plainTime = customType<{
  data: Temporal.PlainTime;
  driverData: string;
}>({
  dataType() {
    return "time";
  },
  fromDriver(value: string): Temporal.PlainTime {
    return Temporal.PlainTime.from(value);
  },
  toDriver(value: Temporal.PlainTime): string {
    return value.toString();
  },
});

export const plainDateTime = customType<{
  data: Temporal.PlainDateTime;
  driverData: string;
}>({
  dataType() {
    return "timestamp";
  },
  fromDriver(value: string): Temporal.PlainDateTime {
    return Temporal.PlainDateTime.from(value);
  },
  toDriver(value: Temporal.PlainDateTime): string {
    return value.toString();
  },
});
