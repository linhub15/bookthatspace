import { api } from "@/src/clients/api";
import { Enums, supabase } from "@/src/clients/supabase";
import { Temporal } from "@js-temporal/polyfill";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetBooking(bookingId: string) {
  return useQuery({
    queryKey: ["room_bookings", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_booking").select("*")
        .eq(
          "id",
          bookingId,
        );

      if (error) {
        alert(error.message);
        return;
      }

      return data.at(0);
    },
  });
}

export function useCreateBooking() {
  const mutation = useMutation({
    mutationFn: async (
      args: {
        roomId: string;
        date: Temporal.PlainDate;
        start: Temporal.PlainTime;
        end: Temporal.PlainTime;
        name: string;
        email: string;
        description?: string;
      },
    ) => {
      const start = Temporal.PlainDateTime.from({
        day: args.date.day,
        month: args.date.month,
        year: args.date.year,
        hour: args.start.hour,
        minute: args.start.minute,
      }).toZonedDateTime(Temporal.Now.timeZoneId());

      const end = Temporal.PlainDateTime.from({
        day: args.date.day,
        month: args.date.month,
        year: args.date.year,
        hour: args.end.hour,
        minute: args.end.minute,
      }).toZonedDateTime(Temporal.Now.timeZoneId());

      const response = await supabase
        .from("room_booking")
        .insert({
          start: start.toString({ timeZoneName: "never" }),
          end: end.toString({ timeZoneName: "never" }),
          room_id: args.roomId,
          booked_by_name: args.name,
          booked_by_email: args.email,
          description: args.description,
          status: "scheduled",
        })
        .select()
        .single();

      return response.data;
    },
    onError: (error) => alert(error.message),
  });
  return mutation;
}

export function useRoomBooking(bookingId: string) {
  return useQuery({
    queryKey: ["room_bookings", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase.from("room_booking").select("*")
        .eq(
          "id",
          bookingId,
        );

      if (error) {
        alert(error.message);
        return;
      }

      return data.at(0);
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { bookingId: string; reason: string }) => {
      await api.reject_booking({
        booking_id: args.bookingId,
        reason: args.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}

export function useSetRoomBookingStatus(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      args: { status: Enums<"room_booking_status"> },
    ) => {
      const { error } = await supabase.from("room_booking").update({
        status: args.status,
      }).eq(
        "id",
        bookingId,
      );

      if (error) {
        alert(error.message);
      }

      queryClient.invalidateQueries({ queryKey: ["room_bookings"] });
    },
  });
}
