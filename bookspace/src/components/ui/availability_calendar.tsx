import { cn } from "@/lib/utils/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Temporal } from "@js-temporal/polyfill";
import { Button } from "./button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Enums, supabase } from "@/clients/supabase";
import { mapDayOfWeekToNumber } from "@/lib/maps/day_of_week";

type Props = {
  value: Temporal.PlainDate | undefined;
  onChange: (value: Temporal.PlainDate | undefined) => void;
  futureMonths?: number;
  roomId?: string;
};

export function AvailabilityCalendar(props: Props) {
  const today = Temporal.Now.plainDateISO();
  const [month, setMonth] = useState(today.toPlainYearMonth());

  const availability = useAvailability(props.roomId);

  const monthText = month.toLocaleString("en-CA", {
    month: "long",
    calendar: month.calendarId,
  });

  const yearText = month.toLocaleString("en-CA", {
    year: "numeric",
    calendar: month.calendarId,
  });

  const days = calendarDays(month)
    .map((day) => {
      if (day === null) return null;

      const availableWeekDays = availability.data?.map((availableDay) =>
        mapDayOfWeekToNumber[availableDay]
      );

      const date = {
        value: day,
        isToday: today.equals(day),
        isSelected: props.value?.equals(day),
        isAvailable: Temporal.PlainDate.compare(day, today) > 0 &&
          availableWeekDays?.includes(day.dayOfWeek),
      };

      return date;
    });

  const hasPreviousMonths =
    Temporal.PlainYearMonth.compare(month, today.toPlainYearMonth()) >
      0;

  return (
    <div className="sm:min-h-[350px]">
      {/* Month heading */}
      <div className="flex place-items-center justify-between">
        <span className="space-x-1.5">
          <span className="font-medium">{monthText}</span>
          <span className="text-gray-500 text-sm">{yearText}</span>
        </span>
        <div>
          {hasPreviousMonths && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth((old) => old.add({ months: -1 }))}
            >
              <ChevronLeftIcon className="size-4 stroke-[2]" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMonth((old) => old.add({ months: 1 }))}
          >
            <ChevronRightIcon className="size-4 stroke-[2]" />
          </Button>
        </div>
      </div>

      {/* Weekdays heading */}
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
          <div
            className="text-gray-500 py-3 text-sm text-center uppercase"
            key={weekday}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="relative grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            className={cn(
              "relative place-self-center text-center size-10 rounded-lg",
              "select-none",
              day?.isAvailable && !day.isSelected
                ? "bg-gray-200 border-2 border-gray-200 hover:border-gray-400"
                : "",
              day?.isSelected && "bg-blue-700 text-white",
              !day && "invisible",
            )}
            key={index}
            disabled={!day?.isAvailable}
            onClick={() => props.onChange(day?.value)}
          >
            <span className="text-sm">{day?.value.day}</span>
            {day?.isToday && (
              <span
                className={cn(
                  "absolute left-1/2 top-1/2 flex h-[5px] w-[5px] -translate-x-1/2 translate-y-[8px] items-center justify-center rounded-full align-middle sm:translate-y-[12px]",
                  day?.isSelected ? "bg-white" : "bg-gray-500",
                )}
              >
                <span className="sr-only">today</span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function calendarDays(month: Temporal.PlainYearMonth) {
  const daysToSkip = month.toPlainDate({ day: 1 }).dayOfWeek;
  const days = new Array(month.daysInMonth)
    .fill(null)
    .map((_, i) =>
      Temporal.PlainDate.from({
        year: month.year,
        month: month.month,
        day: i + 1,
      })
    )
    .toSpliced(0, 0, ...new Array(daysToSkip).fill(null));

  return days;
}

function useAvailability(roomId?: string) {
  const query = useQuery({
    queryKey: ["room", roomId, "availability", "list"],
    queryFn: async () => {
      if (!roomId) return;

      const { data, error } = await supabase
        .from("room_availability")
        .select("day_of_week")
        .eq("room_id", roomId);

      if (error) {
        alert(error);
      }

      return data?.map((day) => day.day_of_week as Enums<"day_of_week">);
    },
    enabled: !!roomId,
  });

  return query;
}
