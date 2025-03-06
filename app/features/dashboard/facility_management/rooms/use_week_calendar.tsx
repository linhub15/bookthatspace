import type { PropsWithChildren } from "react";
import {
  AvailabilityCalendar,
  TimeBlock,
  type TimeBlockProps,
} from "./week_calendar";

type Options = {
  interval?: Minutes;
  earliestHour?: number;
  latestHour?: number;
};

export function useWeekCalendar(options: Options) {
  const interval = options.interval ?? 15;
  const earliestHour = options.earliestHour ?? 0;
  return {
    WeekView: (props: PropsWithChildren) =>
      AvailabilityCalendar({
        ...props,
        interval: interval,
        earliestHour: earliestHour,
        latestHour: options.latestHour ?? 24,
      }),
    Event: (props: Omit<TimeBlockProps, "interval" | "startOffset">) =>
      TimeBlock({
        ...props,
        interval: interval,
        startOffset: earliestHour,
      }),
  };
}
