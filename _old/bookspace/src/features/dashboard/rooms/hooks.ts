import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../clients/supabase";
import { TablesInsert } from "@/clients/supabase";

export function useRooms() {
  const rooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room")
        .select()
        .order("name");

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

export function useUpsertRoom() {
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

      await queryClient.invalidateQueries({ queryKey: ["rooms"] });

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
    mutationFn: async ({ prev, next }: {
      prev?: TablesInsert<"room_availability">[];
      next: TablesInsert<"room_availability">[];
    }) => {
      const errors = [];

      if (prev) {
        const toDelete = prev.filter((old) =>
          !next.map((n) => n.id).includes(old.id)
        ).map((p) => p.id);

        const deleteResponse = await supabase
          .from("room_availability")
          .delete()
          .eq("room_id", args.roomId)
          .in("id", toDelete);

        !!deleteResponse.error && errors.push(deleteResponse.error);
      }

      const upsertResponse = await supabase
        .from("room_availability")
        .upsert([...next])
        .eq("room_id", args.roomId);

      !!upsertResponse.error && errors.push(upsertResponse.error);

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
