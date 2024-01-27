import { Popover } from "@headlessui/react";
import { Calendar } from "../calendar";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Temporal } from "@js-temporal/polyfill";

type Props = {
  value: Temporal.PlainDate | undefined;
  onChange: (value: Temporal.PlainDate | undefined) => void;
};

export function DatePicker(props: Props) {
  return (
    <Popover>
      <Popover.Button className="cursor-auto relative flex gap-x-1 px-4 py-1.5 text-sm w-full rounded-md border-0 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6">
        <span className="text-gray-600">
          {props.value?.toLocaleString("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "numeric",
          }) ?? "Select a date"}
        </span>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <CalendarDaysIcon className="w-5 h-5" />
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-20 bg-white rounded-lg shadow-lg">
        {({ close }) => (
          <Calendar
            mode="single"
            showOutsideDays={false}
            selected={new Date(props.value!.toString())}
            onSelect={(value) => {
              if (!value) return;
              const plainDate = Temporal.PlainDate.from(
                value?.toISOString().split("T")[0],
              );
              props.onChange(plainDate);
              close();
            }}
          />
        )}
      </Popover.Panel>
    </Popover>
  );
}
