import { Card } from "@/components/card";
import { useGetBooking } from "../dashboard/bookings/hooks";
import { viewBookingRoute } from "./renter_portal.routes";
import { Feed } from "@/components/feed";

export function ViewBooking() {
  const { booking_id } = viewBookingRoute.useParams();
  useGetBooking(booking_id);
  return (
    <div className="max-w-xl mx-2 sm:mx-auto space-y-4">
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
