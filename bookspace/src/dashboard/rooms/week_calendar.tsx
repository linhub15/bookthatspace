import { Enums } from "@/src/types/supabase_types";
import { Temporal } from "@js-temporal/polyfill";
import { Fragment, PropsWithChildren, useRef } from "react";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const hours = [...Array(24).keys()].map((hour) => {
  const time = Temporal.PlainTime.from({ hour: hour }).toLocaleString(
    "en-CA",
    { hour: "numeric", hour12: true },
  );
  return time;
});

export function AvailabilityCalendar(
  props: { interval: number } & PropsWithChildren,
) {
  const rowCount = 24 * (60 / props.interval);

  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

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
              className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
            >
              {/* Weekday heading mobile */}
              <div className="grid grid-cols-7 text-sm leading-6 text-gray-600 sm:hidden">
                {weekdayLabels.map((weekday, index) => (
                  <button
                    type="button"
                    className="flex flex-col items-center pb-3 pt-2"
                    key={index}
                  >
                    {weekday.charAt(0)}
                  </button>
                ))}
              </div>
              {/* Weekday heading desktop */}
              <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-600 sm:grid">
                <div className="col-end-1 w-14"></div>
                {weekdayLabels.map((weekday, index) => (
                  <div
                    className="flex items-center justify-center py-3"
                    key={index}
                  >
                    <span>
                      {weekday}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Hours */}
            <div className="flex flex-auto">
              <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                {/* Horizontal lines */}
                <div
                  className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                  style={{
                    gridTemplateRows: "repeat(48, minmax(2.5rem, 1fr))",
                  }}
                >
                  <div ref={containerOffset} className="row-end-1 h-7"></div>
                  {hours.map((hour, index) => (
                    <Fragment key={index}>
                      <div>
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
                  className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
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
  weekday: Enums<"day_of_week">;
  interval: Minutes;
};

export function TimeBlock(props: TimeBlockProps) {
  const blockSize = 60 / props.interval;
  const start = (props.start.hour * blockSize) + 2;
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
      className={`relative mt-px flex sm:col-start-${weekday}`}
      style={{ gridRow: `${start} / span ${span}` }}
    >
      <a
        href="#"
        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
      >
        <p className="order-1 font-semibold text-blue-700">
          Available
        </p>
      </a>
    </li>
  );
}
