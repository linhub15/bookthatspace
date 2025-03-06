import { z } from "zod";

const ListAvailabilityRequest = z.object({
  roomId: z.string(),
  date: z.date(),
});

export async function listAvailability() {
  // todo
}
