import { zRoomAvailabilityInsert } from "@/app/db/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  updateRoomAvailabilityFn,
  type UpdateRoomAvailabilityRequest,
} from "../fns/update_room_availability.fn";

export function useChangeAvailability(args: { roomId: string }) {
  const updateRoomAvailability = useServerFn(updateRoomAvailabilityFn);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (args: UpdateRoomAvailabilityRequest) => {
      const result = zRoomAvailabilityInsert.safeParse(args.next.at(0));
      await updateRoomAvailability({ data: args });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", args.roomId, "availability"],
      });
    },
  });

  return mutation;
}
