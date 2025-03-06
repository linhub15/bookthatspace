import { Hono } from "hono/mod.ts";
import { supabase } from "./middleware/supabase.ts";

const availability = new Hono();

availability.get("/availability", supabase("anon"), async (c) => {
});

export { availability };
