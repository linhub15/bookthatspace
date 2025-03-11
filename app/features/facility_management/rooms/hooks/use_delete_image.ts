import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  deleteRoomImageFn,
  type DeleteRoomImageRequest,
} from "../functions/delete_room_image.fn";

export function useDeleteImage() {
  const queryClient = useQueryClient();
  const deleteRoomImage = useServerFn(deleteRoomImageFn);
  return useMutation({
    mutationFn: async (data: DeleteRoomImageRequest) => {
      await deleteRoomImage({ data: data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
