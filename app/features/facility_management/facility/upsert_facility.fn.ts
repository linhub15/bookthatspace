import { db } from "@/db/database";
import { facility } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { getProfileFn } from "../../profile/get_profile.fn";

const Request = createInsertSchema(facility);
export type UpsertFacilityRequest = z.infer<typeof Request>;

export const upsertFacilityFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: UpsertFacilityRequest) => Request.parse(data))
  .handler(async ({ data }) => {
    const profile = await getProfileFn();
    const upserted = await db
      .insert(facility)
      .values({
        id: data.id,
        profileId: profile.id,
        name: data.name,
        address: data.address,
      })
      .onConflictDoUpdate({
        target: [facility.id],
        set: {
          name: data.name,
          address: data.address,
        },
      })
      .returning();

    return upserted.at(0);
  });
