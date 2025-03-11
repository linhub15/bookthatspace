import { db } from "@/db/database";
import { blob, room_image } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { utapi } from "@/lib/file_store/uploadthing.api";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  roomImageId: z.string(),
});

export type DeleteRoomImageRequest = z.infer<typeof request>;

export const deleteRoomImageFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: DeleteRoomImageRequest) => request.parse(data))
  .handler(async ({ data }) => {
    await db.transaction(async (t) => {
      const roomImage = await db.query.room_image.findFirst({
        where: (image, { eq }) => eq(image.id, data.roomImageId),
        with: {
          blob: true,
        },
      });

      if (!roomImage?.blob.uploadthingMeta?.key) {
        throw notFound();
      }

      await t.delete(room_image).where(
        eq(room_image.id, data.roomImageId),
      );

      await t.delete(blob).where(
        eq(blob.id, roomImage.blob.id),
      );

      const response = await utapi.deleteFiles([
        roomImage.blob.uploadthingMeta.key,
      ]);

      if (!response.success || response.deletedCount !== 1) {
        t.rollback();
        throw new Error("Failed to delete image");
      }
    });
  });
