import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRoomsFn } from "./rooms/list_rooms.fn";
import { upsertRoomFn, type UpsertRoomRequest } from "./rooms/upsert_room.fn";

export function useRooms() {
  const listRooms = useServerFn(listRoomsFn);

  const rooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const rooms = await listRooms();
      return rooms;
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
  const upsertRoom = useServerFn(upsertRoomFn);
  const queryClient = useQueryClient();
  const updateRoom = useMutation({
    mutationFn: async (args: UpsertRoomRequest) => {
      const upserted = await upsertRoom({ data: args });
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      return upserted;
    },
  });
  return updateRoom;
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  const deleteRoom = useMutation({
    mutationFn: async (roomId: string) => {
      // const { error } = await supabase.from("room").delete().eq("id", roomId);

      // if (error) {
      //   alert(error.message);
      //   return;
      // }

      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return deleteRoom;
}

export function useRoomAvailability(roomId: string) {
  const query = useQuery({
    queryKey: ["rooms", "availability", roomId],
    queryFn: async () => {
      // const { data, error } = await supabase
      //   .from("room_availability")
      //   .select()
      //   .eq("room_id", roomId);

      // if (error) {
      //   alert(error.message);
      //   return;
      // }

      return data;
    },
  });

  return query;
}

export function useRoomPhotos(roomId: string) {
  const query = useQuery({
    queryKey: ["rooms", "photos", roomId],
    queryFn: async () => {
      // const { data } = await supabase.from("room_photo").select().eq(
      //   "room_id",
      //   roomId,
      // );

      // const photos = data?.map((photo) => ({
      //   id: photo.id,
      //   url: supabase.storage
      //     .from("room-photos")
      //     .getPublicUrl(photo.path).data.publicUrl,
      // }));

      // return photos;
    },
  });

  return query;
}

export function useUploadPhoto(args: { roomId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // const { data } = await supabase.auth.getUser();
      // const result = await supabase.storage.from("room-photos").upload(
      //   `${data.user?.id}/${args.roomId}/${file.name}`,
      //   file,
      // );

      // if (!result.data?.path) {
      //   alert(result.error?.message);
      //   throw result.error;
      // }

      // await supabase.from("room_photo").insert({
      //   room_id: args.roomId,
      //   path: result.data.path,
      // });

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
      // const { data, error } = await supabase
      //   .from("room_photo")
      //   .delete()
      //   .eq("id", args.photoId)
      //   .select()
      //   .single();

      // if (!data || error) {
      //   throw error;
      // }

      // await supabase.storage.from("room-photos").remove([data.path]);
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

        // const deleteResponse = await supabase
        //   .from("room_availability")
        //   .delete()
        //   .eq("room_id", args.roomId)
        //   .in("id", toDelete);

        // !!deleteResponse.error && errors.push(deleteResponse.error);
      }

      // const upsertResponse = await supabase
      //   .from("room_availability")
      //   .upsert([...next])
      //   .eq("room_id", args.roomId);

      // !!upsertResponse.error && errors.push(upsertResponse.error);

      // if (errors.length > 0) {
      //   console.error(errors);
      //   alert("Error updating availability");
      // }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "availability", args.roomId],
      });
    },
  });

  return mutation;
}
