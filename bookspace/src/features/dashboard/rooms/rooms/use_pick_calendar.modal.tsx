import { Modal } from "@/components/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCalendars } from "./use_calendars";
import { api } from "@/clients/api";

type Props = {
  roomId: string;
};

export function usePickCalendarModal(props: Props) {
  const [open, setOpen] = useState(false);
  const calendars = useCalendars();
  const enableCalendar = useSyncCalendar(props.roomId);

  const modal = () => {
    if (!calendars.data || calendars.data.length === 0) {
      return;
    }

    const pauseCalendarSync = async () => {
      // todo: take all the steps to unlink the calendar
    };

    const resumeCalendarSync = async () => {
    };

    const pickCalendar = async (calendarId: string) => {
      await enableCalendar.mutateAsync({
        calendarId: calendarId,
        enabled: true,
      });
      setOpen(false);
    };
    return (
      <Modal open={open} onDismiss={() => setOpen(false)}>
        <div className="px-4 py-6 sm:px-6">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Google Calendars
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Calendar settings are managed by{" "}
            <a
              className="underline text-blue-600"
              target="_blank"
              href="https://calendar.google.com"
            >
              Google Calendars
            </a>.
          </p>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:px-6 space-y-4">
          {calendars.data.map((d) => (
            <ul key={d.calendar.id}>
              <li className="flex mt-1 justify-between max-w-sm w-full">
                <button
                  className="space-x-2"
                  onClick={() => pickCalendar(d.calendar.id)}
                >
                  <div
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.calendar.backgroundColor }}
                  >
                  </div>
                  <span>
                    {d.calendar.summaryOverride || d.calendar.summary}{" "}
                    ({d.calendar.accessRole})
                  </span>
                </button>
              </li>
            </ul>
          ))}
        </div>
      </Modal>
    );
  };

  return { Modal: modal, open: () => setOpen(true) };
}

function useSyncCalendar(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { calendarId: string; enabled?: boolean }) => {
      const response = await api.google.calendar.sync({
        roomId: roomId,
        calendarId: args.calendarId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["google", "calendars"],
      });
      return response;
    },
  });
}
