import { Card } from "@/components/card";
import {
  availabilityRoute,
  publicBookingRoute,
  publicOutlet,
} from "./public.routes";
import { useFacility, useRooms } from "./hooks";
import { AddressDisplay } from "@/components/form/address_input";
import { Address } from "@/lib/types/address";
import { type Image } from "@/lib/types/image.type";
import { maskHourlyRate } from "@/lib/masks/masks";
import { Link } from "@tanstack/react-router";
import { SubmitButton } from "@/components/buttons/submit_button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function FacilityWidget() {
  const { facility_id } = publicOutlet.useParams();
  const facility = useFacility(facility_id);
  const rooms = useRooms(facility_id);

  if (!facility.data) return;

  return (
    <div className="max-w-screen-lg space-y-4 px-2 sm:mx-auto pt-8">
      <Card>
        <div className="px-4 py-6 sm:px-6">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            {facility.data.name}
          </h3>
          <div className="max-w-2xl text-sm leading-6 text-gray-500">
            <AddressDisplay value={facility.data.address as Address} />
          </div>
          <div className="pt-8 max-w-lg mx-auto">
            <Link
              to={publicBookingRoute.to}
              params={{ facility_id: facility_id }}
            >
              <SubmitButton>Book a Room</SubmitButton>
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-4 py-6 sm:px-6" id="rooms">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Rooms
          </h3>
        </div>
        <div className="px-4 py-6 sm:px-6 space-y-4">
          {rooms.data?.map((room) => (
            <div className="flex flex-col sm:flex-row gap-4" key={room.id}>
              <ImageCarousel images={room.images} />
              {/* <ImageSlider images={room.images} /> */}
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <span className="text-lg">
                    {room.name}{" "}
                    <span className="text-base text-gray-500">
                      ({maskHourlyRate(room.hourly_rate)})
                    </span>
                  </span>
                  <Link
                    className="text-xs leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                    to={availabilityRoute.to}
                    search={{ room_id: room.id }}
                    params={{ facility_id: facility_id }}
                  >
                    View availability
                  </Link>
                </div>
                <div className="text-sm">
                  Max Capacity: {room.max_capacity}
                </div>
                <div className="py-2 whitespace-pre-line">
                  {room.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ImageCarousel(props: { images: Image[] }) {
  return (
    <Carousel className="w-full max-w-sm mx-auto group">
      <CarouselContent>
        {props.images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              className="snap-center object-cover rounded-xl pointer-events-none select-none"
              src={image.url}
              key={image.id}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="opacity-0 group-hover:opacity-95 transition-opacity" />
      <CarouselNext className="opacity-0 group-hover:opacity-95 transition-opacity" />
    </Carousel>
  );
}
