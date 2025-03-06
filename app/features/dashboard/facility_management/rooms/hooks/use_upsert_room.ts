import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  upsertRoomFn,
  type UpsertRoomRequest,
} from "../functions/upsert_room.fn";

export function useUpsertRoom() {
  const upsertRoom = useServerFn(upsertRoomFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpsertRoomRequest) => {
      const upserted = await upsertRoom({ data: args });
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      return upserted;
    },
  });
}
