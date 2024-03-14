import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../clients/supabase";
import { TablesInsert } from "@/clients/supabase";

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

export function useRoom(roomId: string | undefined) {
  const rooms = useRooms();

  if (!roomId) {
    return { data: undefined };
  }

  const room = rooms.data?.find((room) => room.id === roomId);
  return { data: room };
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  const updateRoom = useMutation({
    mutationFn: async (
      args: { room: TablesInsert<"room"> },
    ) => {
      const { data, error } = await supabase
        .from("room")
        .upsert(args.room)
        .select()
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      return data;
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

      const photos = data?.map((photo) => ({
        id: photo.id,
        url: supabase.storage
          .from("room-photos")
          .getPublicUrl(photo.path).data.publicUrl,
      }));

      return photos;
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

export function useDeletePhoto(roomId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (args: { photoId: string }) => {
      const { data, error } = await supabase
        .from("room_photo")
        .delete()
        .eq("id", args.photoId)
        .select()
        .single();

      if (!data || error) {
        throw error;
      }

      await supabase.storage.from("room-photos").remove([data.path]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "photos", roomId],
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
