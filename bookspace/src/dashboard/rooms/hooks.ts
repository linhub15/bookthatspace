import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { TablesInsert, TablesUpdate } from "@/src/types/supabase_types";

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

export function useRoom(roomId: string) {
  const rooms = useRooms();
  const room = rooms.data?.find((room) => room.id === roomId);
  return { data: room };
}

export function useAddRoom() {
  const queryClient = useQueryClient();
  const addRoom = useMutation({
    mutationFn: async (args: TablesInsert<"room">) => {
      const { data, error } = await supabase.from("room").insert(args).select()
        .single();

      if (error || !data) {
        alert(error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      return data;
    },
  });
  return addRoom;
}

export function useUpdateRoom(roomId: string) {
  const queryClient = useQueryClient();
  const updateRoom = useMutation({
    mutationFn: async (
      args: { room: TablesUpdate<"room"> },
    ) => {
      const { error } = await supabase
        .from("room")
        .update(args.room)
        .eq("id", roomId);

      if (error) {
        alert(error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
  return updateRoom;
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

export function useRoomAvailability(roomId: string) {
  const query = useQuery({
    queryKey: ["rooms", "availability", roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_availability")
        .select()
        .eq("room_id", roomId);

      if (error) {
        alert(error.message);
        return;
      }

      return data;
    },
  });

  return query;
}

export function useRoomPhotos(roomId: string) {
  const query = useQuery({
    queryKey: ["rooms", "photos", roomId],
    queryFn: async () => {
      const { data } = await supabase.from("room_photo").select().eq(
        "room_id",
        roomId,
      );

      const url = data?.map((photo) =>
        supabase.storage.from("room-photos").getPublicUrl(photo.path).data
          .publicUrl
      );

      return url;
    },
  });

  return query;
}

export function useUploadPhoto(args: { roomId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const { data } = await supabase.auth.getUser();
      const result = await supabase.storage.from("room-photos").upload(
        `${data.user?.id}/${args.roomId}/${file.name}`,
        file,
      );

      if (!result.data?.path) {
        alert(result.error?.message);
        throw result.error;
      }

      await supabase.from("room_photo").insert({
        room_id: args.roomId,
        path: result.data.path,
      });

      queryClient.invalidateQueries({
        queryKey: ["rooms", "photos", args.roomId],
      });
    },
  });
  return mutation;
}

export function useChangeAvailability(args: { roomId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (
      availabilities: {
        action: "upsert" | "delete";
        payload: TablesInsert<"room_availability">;
      }[],
    ) => {
      const toDelete = availabilities
        .filter((a) => a.action === "delete" && a.payload.id)
        .map((a) => a.payload.id);
      const toInsert = availabilities
        .filter((a) => a.action === "upsert" && !a.payload.id)
        .map((a) => {
          delete a.payload.id;
          return a.payload;
        });
      const toUpdate = availabilities
        .filter((a) => a.action === "upsert" && a.payload.id)
        .map((a) => a.payload);

      const errors = [];

      if (toUpdate.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .upsert([...toUpdate])
          .eq("room_id", args.roomId);

        !!error && errors.push(error);
      }

      if (toInsert.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .insert([...toInsert]);

        !!error && errors.push(error);
      }

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from("room_availability")
          .delete()
          .in("id", toDelete);

        !!error && errors.push(error);
      }

      if (errors.length > 0) {
        console.error(errors);
        alert("Error updating availability");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "availability", args.roomId],
      });
    },
  });

  return mutation;
}
