import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRoomsFn } from "../fns/list_rooms.fn";

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
  const rooms = useRooms();

  if (!roomId) {
    return { data: undefined };
  }

  const room = rooms.data?.find((room) => room.id === roomId);

  return { data: room };
}
