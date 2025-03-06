import { db } from "@/app/db/database";
import { room_image } from "@/app/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { z } from "zod";

const request = z.object({
  facilityId: z.string(),
});
export type GetFacilityPublicRequest = z.infer<typeof request>;

export const getFacilityPublicFn = createServerFn({ method: "GET" })
  .middleware([]) // todo: add captcha middleware
  .validator((data: GetFacilityPublicRequest) => request.parse(data))
  .handler(async ({ data }) => {
    // todo: find a way to determine the baseURL
    const baseUrl = sql`'http://localhost:3000'`;
    const imageFullUrl = sql<string>`concat(${baseUrl},${room_image.path})`.as(
      "url",
    );

    const result = await db
      .query
      .facility
      .findFirst({
        where: (facility, { eq }) => eq(facility.id, data.facilityId),
        with: {
          rooms: {
            with: {
              images: {
                extras: {
                  url: imageFullUrl,
                },
              },
            },
          },
        },
      });

    return result;
  });
