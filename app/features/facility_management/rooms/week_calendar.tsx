// Moved this into a separate file for Vite "fast refresh" warning
import type { DayOfWeekEnum } from "@/app/db/types";
import { Fragment, type PropsWithChildren, useMemo, useRef } from "react";
import { Temporal } from "temporal-polyfill";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  interval: number;
  earliestHour: number;
  latestHour: number;
} & PropsWithChildren;

export function AvailabilityCalendar(props: Props) {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  const hours = useMemo(() => {
    const { earliestHour } = props;
    let { latestHour } = props;
    if (latestHour < 24) {
      // add 1 hour spacing under it, but not more than 24
      latestHour = Math.min(latestHour + 1, 24);
    }
    const hourRange = latestHour - earliestHour;
    const hrs = Array.from(
      { length: hourRange },
      (_, i) => i + (earliestHour ?? 0),
    );

    return hrs.map((hour) =>
      Temporal.PlainTime.from({ hour: hour }).toLocaleString(
        "en-CA",
        { hour: "numeric", hour12: true },
      )
    );
  }, [props]);

  const rowCount = hours.length * (60 / props.interval);

  return (
    <div className="h-0 min-h-[765px]">
      <div className="flex h-full flex-col">
        <div
          ref={container}
          className="isolate flex flex-auto flex-col overflow-auto bg-white"
        >
          <div className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
            <div
              ref={containerNav}
              className="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black ring-opacity-5 sm:pr-8"
            >
              {/* Weekday heading mobile */}
              <div className="grid grid-cols-7 text-sm leading-6 text-gray-600 sm:hidden">
                {weekdayLabels.map((weekday) => (
                  <div
                    className="flex flex-col items-center pb-3 pt-2"
                    key={weekday}
                  >
                    {weekday.charAt(0)}
                  </div>
                ))}
              </div>
              {/* Weekday heading desktop */}
              <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-600 sm:grid">
                <div className="col-end-1 w-14" />
                {weekdayLabels.map((weekday) => (
                  <div
                    className="flex items-center justify-center py-3"
                    key={weekday}
                  >
                    <span>
                      {weekday}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours desktop */}
            <div className="flex flex-auto">
              <div className="hidden sm:block sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                {/* Horizontal lines */}
                {/* Reduce the minmax for width */}
                <div
                  className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                  style={{
                    gridTemplateRows: `repeat(${
                      2 * hours.length
                    }, minmax(1.5rem, 1fr))`,
                  }}
                >
                  <div ref={containerOffset} className="row-end-1 h-7" />
                  {hours.map((hour) => (
                    <Fragment key={hour}>
                      <div className="invisible sm:visible">
                        <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-500">
                          {hour}
                        </div>
                      </div>
                      <div />
                    </Fragment>
                  ))}
                </div>

                {/* Vertical lines */}
                <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                  <div className="col-start-1 row-span-full" />
                  <div className="col-start-2 row-span-full" />
                  <div className="col-start-3 row-span-full" />
                  <div className="col-start-4 row-span-full" />
                  <div className="col-start-5 row-span-full" />
                  <div className="col-start-6 row-span-full" />
                  <div className="col-start-7 row-span-full" />
                  <div className="col-start-8 row-span-full w-8" />
                </div>

                {/* Events */}
                <ol
                  className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 sm:pr-8"
                  style={{
                    gridTemplateRows:
                      `1.75rem repeat(${rowCount}, minmax(0, 1fr)) auto`,
                  }}
                >
                  {props.children}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type TimeBlockProps = {
  start: Temporal.PlainTime;
  end: Temporal.PlainTime;
  weekday: DayOfWeekEnum;
  interval: Minutes;
  startOffset: number;
};

export function TimeBlock(props: TimeBlockProps) {
  const blockSize = 60 / props.interval;
  const start = ((props.start.hour - props.startOffset) * blockSize) + 2;
  const duration = props.start.until(props.end, { largestUnit: "minutes" });
  const span = duration.round({
    roundingIncrement: props.interval,
    largestUnit: "minutes",
    smallestUnit: "minutes",
  }).minutes / props.interval;

  const weekday = 1 + // ISO 8601 weekday starts at 1
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(props.weekday);

  return (
    <li
      className="relative mt-px flex flex-col"
      style={{
        gridColumnStart: weekday,
        gridRow: `${start} / span ${span}`,
      }}
    >
      <div className="sm:hidden text-xs absolute -top-[1.15rem] self-center z-10">
        {props.start.toLocaleString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })}
      </div>
      <div className="group absolute inset-1 flex flex-col mx-auto sm:mx-0 w-4 sm:w-auto overflow-y-auto rounded-full sm:rounded-lg bg-blue-100 p-2 text-xs leading-5 hover:bg-blue-200">
        <p className="hidden sm:inline order-1 font-semibold text-blue-700">
          Available
        </p>
      </div>
      <div className="sm:hidden text-xs absolute -bottom-[1.15rem] self-center z-10">
        {props.end.toLocaleString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        })}
      </div>
    </li>
  );
}
