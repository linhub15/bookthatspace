import { Card } from "@/src/components/card";
import { publicBookingRoute, publicOutlet } from "./public.routes";
import { useFacility, useRooms } from "./hooks";
import { AddressDisplay } from "@/src/components/form/address_input";
import { Address } from "@/src/types/address";
import { type Image } from "@/src/types/image.type";
import { MouseEvent, useRef, useState } from "react";
import { maskHourlyRate } from "@/src/masks/masks";
import { Link } from "@tanstack/react-router";
import { SubmitButton } from "@/src/components/buttons/submit_button";

export function AvailabilityWidget() {
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
        <div className="px-4 py-6 sm:px-6">
          {rooms.data?.map((room) => (
            <div className="flex flex-col sm:flex-row gap-4" key={room.id}>
              <ImageSlider images={room.images} />
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <span className="text-lg">
                    {room.name}{" "}
                    <span className="text-base text-gray-500">
                      ({maskHourlyRate(room.hourly_rate)})
                    </span>
                  </span>
                  <a
                    className="text-xs leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                    href="#"
                  >
                    View availability
                  </a>
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

function ImageSlider(props: { images: Image[] }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({
    startX: 0,
    scrollLeft: 0,
  });

  const dragStart = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    if (!ref.current) return;
    const slider = ref.current.children.item(0) as HTMLImageElement;
    if (!slider) return;
    const startX = event.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;
    mouseCoords.current = { startX, scrollLeft };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
  };

  const dragEnd = () => {
    setIsMouseDown(false);
    document.body.style.cursor = "default";
  };

  const scrollX = (
    event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    if (!ref.current || !isMouseDown) return;
    event.preventDefault();

    const slider = ref.current.children.item(0) as HTMLImageElement;
    if (!slider) return;
    const x = event.pageX - slider.offsetLeft;
    const walkX = x - mouseCoords.current.startX;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
  };

  return (
    <div
      className="flex overflow-x-scroll sm:w-[40em] sm:h-64"
      ref={ref}
      onMouseDown={dragStart}
      onMouseUp={dragEnd}
      onMouseMove={scrollX}
    >
      <div className="flex overflow-x-scroll rounded-xl snap-x snap-mandatory space-x-2 active:cursor-grabbing md:active:snap-none">
        {props.images.map((image) => (
          <img
            className="snap-center object-cover rounded-xl pointer-events-none select-none"
            src={image.url}
            key={image.id}
          />
        ))}
      </div>
    </div>
  );
}
