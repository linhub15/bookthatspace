import { Temporal } from "@js-temporal/polyfill";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../clients/api";

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
