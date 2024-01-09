import { cn } from "@/lib/utils/cn";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

type Entry = {
  label: string;
  date: string;
  status: "not_started" | "in_progress" | "done";
};

type Props = {
  timeline?: Entry[];
};

export function Feed(props: Props) {
  const { timeline } = props;

  if (!timeline) {
    return null;
  }

  const icon = {
    not_started: <Fragment />,
    in_progress: <ArrowPathIcon className="h-5 w-5 text-white" />,
    done: <CheckIcon className="h-5 w-5 text-white" />,
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIndex) => (
          <li key={eventIndex}>
            <div className="relative pb-8">
              {eventIndex !== timeline.length - 1
                ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )
                : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      { "bg-gray-200": event.status === "not_started" },
                      { "bg-blue-500": event.status === "in_progress" },
                      { "bg-green-500": event.status === "done" },
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                    )}
                  >
                    {icon[event.status]}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.label}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.date}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
