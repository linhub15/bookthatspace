import { SubmitButton } from "@/components/buttons/submit_button";
import { Card } from "@/components/card";
import { AddressDisplay } from "@/components/form/address_input";
import { GoogleMapImg } from "@/components/google_map";
import { useFacilityPublic } from "@/features/public/hooks/use_facility.public";
import { maskHourlyRate } from "@/lib/masks/masks";
import type { Image } from "@/lib/types/image.type";
import { cn } from "@/lib/utils/cn";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Route as availabilityRoute } from "./availability";
import { Route as makeBookingRoute } from "./book";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  Carousel,
  CarouselContent,
  CarouselIndicatorDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { RoomSelect } from "@/db/types";

export const Route = createFileRoute("/@/$facilityId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { facilityId } = Route.useParams();
  const facility = useFacilityPublic(facilityId);

  if (!facility.data) return;

  const rooms = facility.data.rooms;

  return (
    <div className="max-w-(--breakpoint-lg) space-y-4 px-2 sm:mx-auto pt-8">
      <Card className="max-w-(--breakpoint-md) mx-auto">
        <div className="flex justify-between w-full px-4 py-6 sm:px-6 gap-8">
          <div className="flex flex-col w-full justify-between">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                {facility.data.name}
              </h3>
              <div className="text-sm leading-6 text-gray-500">
                <AddressDisplay value={facility.data.address} />
              </div>
            </div>
            <Link
              className="max-w-xs"
              to={makeBookingRoute.to}
              params={{ facilityId: facilityId }}
            >
              <SubmitButton>Book a Room</SubmitButton>
            </Link>
          </div>

          <div className="w-96 rounded-xl overflow-hidden">
            {facility.data.address &&
              <GoogleMapImg address={facility.data.address} />}
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 py-8 sm:justify-center flex-wrap">
        {rooms.map((room) => (
          <RoomCard room={room} photos={room.images} key={room.id} />
        ))}
      </div>
    </div>
  );
}

export function RoomCard(
  { room, photos }: { room: RoomSelect; photos: Image[] },
) {
  return (
    <Card className="flex flex-col gap-2 p-4 sm:rounded-xl overflow-hidden md:max-w-[328px]">
      <ImageCarousel images={photos} />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            {room.name}
          </span>
          <Link
            className="text-xs leading-6 font-medium text-indigo-600 hover:text-indigo-500"
            to={availabilityRoute.to}
            search={{ roomId: room.id }}
            params={{ facilityId: room.facilityId }}
          >
            Availability
          </Link>
        </div>
        <div className="text-sm text-gray-600">
          Maximum {room.maxCapacity} people
        </div>
        <div className="text-sm">
          {maskHourlyRate(room.hourlyRate)}
        </div>
      </div>
    </Card>
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
        {props.images.map((image) => (
          <CarouselItem key={image.id}>
            <img
              className={cn("snap-center object-cover object-center", styles)}
              src={image.url}
              key={image.id}
              alt=""
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="opacity-0 group-hover:opacity-95 transition-opacity" />
      <CarouselNext className="opacity-0 group-hover:opacity-95 transition-opacity" />
      <CarouselIndicatorDots />
    </Carousel>
  );
}
