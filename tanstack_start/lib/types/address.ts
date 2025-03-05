import { z } from "zod";

export type Address = z.infer<typeof zAddress>;
export const zAddress = z.object({
  address: z.string(),
  city: z.string(),
  administrative_division: z.string(),
  country: z.string(),
  postal_code: z.string(),
});
