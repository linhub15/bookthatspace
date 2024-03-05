import { Card } from "@/src/components/card";
import { confirmationRoute } from "./public.routes";
import { Feed } from "@/src/components/feed";
import { Link } from "@tanstack/react-router";
import { useGetBooking } from "../dashboard/bookings/hooks";
import { viewBookingRoute } from "../renter_portal/renter_portal.routes";

export function Confirmation() {
  const { booking_id } = confirmationRoute.useSearch();
  const booking = useGetBooking(booking_id);
  return (
    <div className="max-w-xl mx-2 sm:mx-auto space-y-4">
      <Card>
        <div className="p-8">
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            Booking received!
          </p>
          <p className="mt-2 text-base text-gray-500">
            An email will be sent to{" "}
            <strong>{booking.data?.booked_by_email}</strong>{" "}
            when the booking is reviewed.
          </p>

          <div className="pt-10">
            <Link
              className="text-indigo-600 underline"
              to={viewBookingRoute.to}
              params={{ booking_id }}
            >
              Review booking
            </Link>
          </div>
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
