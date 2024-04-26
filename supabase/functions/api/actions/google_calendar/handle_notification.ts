import { z } from "zod";

export const NotificationHeader = z.object({
  /** UUID or other unique string you provided to identify this
   * notification channel. */
  "X-Goog-Channel-ID": z.string(),
  /** Notification channel token that was set by your application, and that
   * you can use to verify the notification source. Only present if defined. */
  "X-Goog-Channel-Token": z.string(),
  /** In human-readable format. Present only if the channel expires. */
  "X-Goog-Channel-Expiration": z.string(),
  /** An opaque value identifying the watched resource.
   * This ID is stable across API versions. */
  "X-Goog-Resource-ID": z.string(),
  /** An API-version-specific identifier for the watched resource.  */
  "X-Goog-Resource-URI": z.string(),
  /** The new resource state that triggered the notification.
   * Possible values: sync, exists, or not_exists.  */
  "X-Goog-Resource-State": z.union([
    z.literal("sync"),
    z.literal("exists"),
    z.literal("not_exists"),
  ]),
  /** Integer that identifies this message for this notification channel.
   * Value is always 1 for sync messages.
   * Message numbers increase for each subsequent message on the channel,
   * but they're not sequential. */
  "X-Goog-Message-Number": z.number(),
}).transform((data) => ({
  id: data["X-Goog-Channel-ID"],
  token: data["X-Goog-Channel-Token"],
  expiration: data["X-Goog-Channel-Expiration"],
  resourceId: data["X-Goog-Resource-ID"],
  resourceUri: data["X-Goog-Resource-URI"],
  resourceState: data["X-Goog-Resource-State"],
  messageNumber: data["X-Goog-Message-Number"],
}));

type NotificationHeader = z.infer<typeof NotificationHeader>;

type Request = {
  header: NotificationHeader;
  body?: string;
};
export async function handleNotification(request: Request) {
  if (request.header.resourceState === "sync") {
    // skip deliberately
    return; // https://developers.google.com/calendar/api/guides/push#sync-message
  }

  if (request.header.resourceState === "exists") {
    // exists: creation, modification, or deletion
    // fetch the resource and update our db
    // todo
    return;
  }

  if (request.header.resourceState === "not_exists") {
    // not exists
    // delete it from our db
    // todo
    return;
  }

  throw new Error(`Unknown resource state ${request.header.resourceState}`);
}
