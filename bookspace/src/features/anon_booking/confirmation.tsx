import { cn } from "@/lib/utils/cn";
import { Card } from "@/src/components/card";

export function Confirmation() {
  const { booking_id } = confirmationRoute.useSearch();
  return (
    <div className="max-w-xl mx-2 sm:mx-auto space-y-4">
      <Card>
        <div className="p-8">
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            Booking received!
          </p>
          <p className="mt-2 text-base text-gray-500">
            You will receive an email once the booking has been reviewed.
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Tracking link</dt>
            <dd className="mt-2 text-indigo-600">{booking_id}</dd>
          </dl>
        </div>
      </Card>

      <Card>
        <div className="p-8">
          <Feed />
        </div>
      </Card>
    </div>
  );
}

import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid";
import { confirmationRoute } from "./anon_booking.routes";

const timeline = [
  {
    id: 1,
    content: "Booking received",
    target: "",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: CheckIcon,
    iconBackground: "bg-green-500",
  },
  {
    id: 2,
    content: "Under review",
    target: "",
    href: "#",
    date: "",
    datetime: "",
    icon: ArrowPathIcon,
    iconBackground: "bg-blue-500 animate-spin-slow",
  },
];

export default function Feed() {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1
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
                      event.iconBackground,
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                    )}
                  >
                    <event.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{" "}
                      <a
                        href={event.href}
                        className="font-medium text-gray-900"
                      >
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
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
