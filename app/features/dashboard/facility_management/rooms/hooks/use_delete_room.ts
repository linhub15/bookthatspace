import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteRoomFn } from "../functions/delete_room.fn";

export function useDeleteRoom() {
  const deleteRoom = useServerFn(deleteRoomFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      await deleteRoom({ data: { roomId } });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
