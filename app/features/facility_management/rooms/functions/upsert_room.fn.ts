import { db } from "@/db/database";
import { room } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

const request = createInsertSchema(room);
export type UpsertRoomRequest = z.infer<typeof request>;

export const upsertRoomFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: UpsertRoomRequest) => request.parse(data))
  .handler(
    async ({ data }) => {
      const upserted = await db
        .insert(room)
        .values(data)
        .onConflictDoUpdate({
          target: [room.id],
          set: data,
        })
        .returning();

      return upserted.at(0) ?? null;
    },
  );
