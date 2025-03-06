import { authMiddleware } from "@/lib/auth/auth_middleware";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db/database";

export const getProfileFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await db.query.profile.findFirst({
      where: (profile, { eq }) => eq(profile.userId, context.session.user.id),
      with: {
        user: true,
      },
    });

    if (!profile) {
      throw notFound();
    }

    return profile;
  });
