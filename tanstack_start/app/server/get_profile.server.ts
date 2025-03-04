import { authMiddleware } from "@/lib/auth/auth_middleware";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../db/database";

export const getProfile = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, context.session.user.id),
    });

    if (!user) {
      throw notFound();
    }

    return user;
  });
