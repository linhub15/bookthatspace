import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

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
