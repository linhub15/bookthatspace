import { db } from "@/db/database";
import { room } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

export const deleteRoomFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { roomId: string }) => data.roomId)
  .handler(async ({ data }) => {
    await db.delete(room).where(eq(room.id, data));
  });
