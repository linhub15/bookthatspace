import { db } from "@/db/database";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";

export const getRoomFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { roomId: string }) => data.roomId)
  .handler(async ({ data }) => {
    const room = await db.query.room.findFirst({
      where: (r, { eq }) => eq(r.id, data),
      with: {
        images: {
          with: { blob: true },
        },
      },
    });

    return room;
  });
