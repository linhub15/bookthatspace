import { maskHourlyRate } from "@/lib/masks/masks";
import { cn } from "@/lib/utils/cn";
import { Description, Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useFacilityPublic } from "./hooks/use_facility.public";

type Props = {
  id?: string;
  name?: string;
  facilityId: string;
  value: string | undefined;
  onChange: (value: string) => void;
};

export function RoomPicker(props: Props) {
  const facility = useFacilityPublic(props.facilityId);
  const rooms = facility.data?.rooms;
  return (
    <RadioGroup
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={(v) => props.onChange(v)}
    >
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {rooms?.map((room) => (
          <Radio
            key={room.id}
            value={room.id}
            className={cn(
              "data-[active]:border-indigo-600 data-[active]:ring-2 data-[active]:ring-indigo-600",
              "border-gray-300",
              "relative flex rounded-lg border bg-white p-4 shadow-sm focus:outline-none select-none",
            )}
          >
            {({ checked }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {room.name}
                    </span>
                    <Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {room.description}
                    </Description>
                    <Description
                      as="span"
                      className="mt-6 text-sm font-medium text-gray-900"
                    >
                      {maskHourlyRate(room.hourlyRate)}
                    </Description>
                  </span>
                </span>
                <CheckCircleIcon
                  className={cn(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-indigo-600",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "todo: active:::: border",
                    "border-2",
                    checked ? "border-indigo-600" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg",
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}
