import { z } from "zod";

const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export type Image = z.infer<typeof imageSchema>;
