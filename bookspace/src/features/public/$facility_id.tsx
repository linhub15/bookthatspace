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
import { PhotoIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";
import { Tables } from "@/clients/supabase";

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
        <div className="flex flex-col p-4 gap-6 sm:p-6 lg:p-8 lg:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {rooms.data?.map((room) => (
            <RoomCard room={room} photos={room.images} key={room.id} />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function RoomCard(
  { room, photos }: { room: Tables<"room">; photos: Image[] },
) {
  return (
    <div className="flex flex-col gap-2 rounded-xl overflow-hidden">
      <ImageCarousel images={photos} />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            {room.name}
          </span>
          <Link
            className="text-xs leading-6 font-medium text-indigo-600 hover:text-indigo-500"
            to={availabilityRoute.to}
            search={{ room_id: room.id }}
            params={{ facility_id: room.facility_id }}
          >
            Availability
          </Link>
        </div>
        <div className="text-sm text-gray-600">
          Maximum {room.max_capacity} people
        </div>
        <div className="text-sm">
          {maskHourlyRate(room.hourly_rate)}
        </div>
      </div>
    </div>
  );
}

function ImageCarousel(props: { images: Image[] }) {
  const styles = cn(
    "w-full h-72 mx-auto rounded-xl pointer-events-none select-none",
  );
  return (
    <Carousel className="group">
      <CarouselContent>
        {props.images.length === 0 && (
          <CarouselItem>
            <div className={cn("grid bg-slate-100", styles)}>
              <PhotoIcon className="size-20 place-self-center text-slate-300" />
            </div>
          </CarouselItem>
        )}
        {props.images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              className={cn("snap-center object-cover object-center", styles)}
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
