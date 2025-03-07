import { useMutation } from "@tanstack/react-query";
import {
  createBookingFn,
  type CreateBookingRequest,
} from "../functions/create_booking.fn";
import { useServerFn } from "@tanstack/react-start";

export function useCreateBooking() {
  const createBooking = useServerFn(createBookingFn);
  return useMutation({
    mutationFn: async (args: CreateBookingRequest) => {
      await createBooking({ data: args });
    },
  });
}
