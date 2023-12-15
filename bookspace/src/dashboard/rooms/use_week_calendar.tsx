import { PropsWithChildren } from "react";
import {
  AvailabilityCalendar,
  TimeBlock,
  TimeBlockProps,
} from "./week_calendar";

export function useWeekCalendar() {
  const eventInterval: Minutes = 15;
  return {
    WeekView: (props: PropsWithChildren) =>
      AvailabilityCalendar({ ...props, interval: eventInterval }),
    Event: (props: Omit<TimeBlockProps, "interval">) =>
      TimeBlock({ ...props, interval: eventInterval }),
  };
}
