import { Link, useNavigate } from "@tanstack/react-router";
import { useDeleteRoom, useRooms } from "./hooks";

type Props = {
  roomId: string;
};

export function Room(props: Props) {
  const rooms = useRooms();
  const navigate = useNavigate();
  const room = rooms.data?.find((room) => room.id === props.roomId);
  const deleteRoom = useDeleteRoom();

  if (!room) return <div>loading...</div>;

  const onDelete = async () => {
    await deleteRoom.mutateAsync(room.id, {
      onSuccess: () => navigate({ to: "/dashboard/rooms" }),
    });
  };

  return (
    <div>
      <Link to="/dashboard/rooms">Back</Link>
      <div>
        <div>
          {room.name}
        </div>
        <button
          className="bg-red-600 text-white rounded px-4 py-2"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
