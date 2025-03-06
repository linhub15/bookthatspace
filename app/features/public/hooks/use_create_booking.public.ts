import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createBookingPublicFn,
  type CreateBookingPublicRequest,
} from "../functions/create_booking.public.fn";

export function useCreateBookingPublic() {
  const createBooking = useServerFn(createBookingPublicFn);

  return useMutation({
    mutationFn: async (
      args: CreateBookingPublicRequest,
    ) => {
      const response = await createBooking({ data: args });

      return response;
    },
  });
}
