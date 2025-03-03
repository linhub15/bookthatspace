import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

type CalendarProps = ComponentProps<typeof DayPicker>;
export function Calendar({
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={false}
      className="p-3"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-blue-400/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day:
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-lg hover:bg-blue-300/50",
        day_range_end: "day-range-end",
        day_selected:
          "bg-indigo-600 text-white hover:bg-indigo-300 hover:text-white",
        day_today: "underline bg-blue-400 text-white",
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
