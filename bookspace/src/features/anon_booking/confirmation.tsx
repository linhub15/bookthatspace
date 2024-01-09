import { Card } from "@/src/components/card";
import { confirmationRoute } from "./anon_booking.routes";
import { Feed } from "@/src/components/feed";

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
          <Feed
            timeline={[
              {
                label: "Booking received",
                date: "enable RLS to show",
                status: "done",
              },
              {
                label: "Under review",
                date: "",
                status: "in_progress",
              },
              {
                label: "Payment",
                date: "",
                status: "not_started",
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
