import { db } from "@/db/database";
import { room } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

export const getRoomFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((data: { roomId: string }) => data.roomId)
  .handler(async ({ data }) => {
    const result = await db.select()
      .from(room)
      .where(eq(room.id, data));

    return result.at(0);
  });
