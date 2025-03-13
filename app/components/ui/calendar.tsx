import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

type Props = ComponentProps<typeof DayPicker>;

export function Calendar({
  ...props
}: Props) {
  return (
    <DayPicker
      mode="single"
      showOutsideDays={false}
      className="p-3"
      classNames={{
        months: "relative w-fit",
        month: "space-y-4",
        month_caption: "flex pt-1 relative",
        caption_label: "text-sm font-medium",
        nav: "absolute end-0 z-1",
        button_previous: "h-7 w-7",
        button_next: "h-7 w-7",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
      }}
      components={{
        PreviousMonthButton: (props) => (
          <button {...props}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        ),
        NextMonthButton: (props) => (
          <button {...props}>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        ),
      }}
      {...props}
    />
  );
}
