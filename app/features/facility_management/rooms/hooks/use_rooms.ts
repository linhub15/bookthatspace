import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRoomsFn } from "../functions/list_rooms.fn";
import { getRoomFn } from "../functions/get_room.fn";

export function useRooms() {
  const listRooms = useServerFn(listRoomsFn);

  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      return await listRooms();
    },
  });
}

export function useRoom(roomId: string | undefined) {
  const getRoom = useServerFn(getRoomFn);

  return useQuery({
    queryKey: ["rooms", roomId],
    enabled: !!roomId,
    queryFn: async () => {
      if (!roomId) return null;

      return await getRoom({ data: { roomId } });
    },
  });
}
