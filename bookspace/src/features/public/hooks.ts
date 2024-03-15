import { Temporal } from "@js-temporal/polyfill";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../clients/api";
import { supabase } from "@/clients/supabase";

export function useFacility(facilityId: string) {
  return useQuery({
    queryKey: ["facility", facilityId],
    enabled: !!facilityId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility")
        .select()
        .eq("id", facilityId)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      return data;
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

      const response = await api.request_booking({
        room_id: args.roomId,
        start: start.toString({ timeZoneName: "never" }),
        end: end.toString({ timeZoneName: "never" }),
        name: args.name,
        email: args.email,
        description: args.description,
      });

      return response;
    },
  });
  return mutation;
}

export function useRooms(facilityId: string) {
  const rooms = useQuery({
    queryKey: ["rooms", facilityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select(
          `*, room_photo(*)`,
        ).eq(
          "facility_id",
          facilityId,
        ).order("name");

      if (error) {
        alert(error.message);
        return;
      }

      return data.map((room) => ({
        ...room,
        images: room.room_photo.map((photo) => ({
          id: photo.id,
          url: supabase.storage
            .from("room-photos")
            .getPublicUrl(photo.path).data.publicUrl,
        })),
      }));
    },
    enabled: !!facilityId,
  });
  return rooms;
}
