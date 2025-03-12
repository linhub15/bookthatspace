import { db } from "@/db/database";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const request = z.object({
  facilityId: z.string(),
});
export type GetFacilityPublicRequest = z.infer<typeof request>;

export const getFacilityPublicFn = createServerFn({ method: "GET" })
  .middleware([]) // todo: add captcha middleware
  .validator((data: GetFacilityPublicRequest) => request.parse(data))
  .handler(async ({ data }) => {
    const result = await db
      .query
      .facility
      .findFirst({
        where: (facility, { eq }) => eq(facility.id, data.facilityId),
        with: {
          rooms: {
            with: {
              images: {
                columns: { id: true },
                with: {
                  blob: {
                    columns: { uploadthingMeta: true },
                  },
                },
              },
            },
          },
        },
      });

    if (!result) {
      throw notFound();
    }

    result?.rooms.map((room) => ({
      room: room.images.map((i) => ({
        id: i.id,
        url: i.blob.uploadthingMeta?.ufsUrl,
      })),
    }));

    return ({
      ...result,
      rooms: result?.rooms.map((room) => ({
        ...room,
        images: room.images.map((i) => ({
          id: i.id,
          url: i.blob.uploadthingMeta?.ufsUrl ?? "",
        })),
      })),
    });
  });
