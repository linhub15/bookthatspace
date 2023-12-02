import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

export function useRooms() {
  const rooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("room")
        .select();
      if (error) {
        alert(error.message);
      }
      return data;
    },
  });

  return rooms;
}

export function useAddRoom() {
  const queryClient = useQueryClient();
  const addRoom = useMutation({
    mutationFn: async (args: { name: string; hourly_cost: number }) => {
      const { error } = await supabase.from("room").insert({
        name: args.name,
        hourly_cost: args.hourly_cost ?? null,
      });

      if (error) {
        alert(error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
  return addRoom;
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  const deleteRoom = useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase.from("room").delete().eq("id", roomId);

      if (error) {
        alert(error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return deleteRoom;
}
