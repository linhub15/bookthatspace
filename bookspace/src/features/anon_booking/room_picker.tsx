import { maskHourlyRate } from "@/src/masks/masks";
import { supabase } from "@/src/supabase";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils/cn";

type Props = {
  id?: string;
  name?: string;
  profileId: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function RoomPicker(props: Props) {
  const rooms = useQuery({
    queryKey: ["rooms", props.profileId],
    queryFn: async () => {
      const { data, error } = await supabase.from("room").select().eq(
        "profile_id",
        props.profileId!,
      );

      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
    enabled: !!props.profileId,
  });

  return (
    <RadioGroup
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={(v) => props.onChange(v)}
    >
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {rooms.data?.map((room) => (
          <RadioGroup.Option
            key={room.id}
            value={room.id}
            className={({ active }) =>
              cn(
                active
                  ? "border-indigo-600 ring-2 ring-indigo-600"
                  : "border-gray-300",
                "relative flex rounded-lg border bg-white p-4 shadow-sm focus:outline-none select-none",
              )}
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {room.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {room.description}
                    </RadioGroup.Description>
                    <RadioGroup.Description
                      as="span"
                      className="mt-6 text-sm font-medium text-gray-900"
                    >
                      {maskHourlyRate(room.hourly_rate)}
                    </RadioGroup.Description>
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
                    active ? "border" : "border-2",
                    checked ? "border-indigo-600" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg",
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
