import { Card } from "@/components/card";
import { Feed } from "@/components/feed";
import { useBookingPublic } from "@/features/public/hooks/use_booking.public";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/@/booking-success/$bookingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookingId } = Route.useParams();
  const booking = useBookingPublic(bookingId);

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
            <strong>{booking.data?.bookedByEmail}</strong>{" "}
            when the booking is reviewed.
          </p>
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
