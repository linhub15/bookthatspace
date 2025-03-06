import { Hono } from "hono/mod.ts";
import { cors } from "hono/middleware.ts";
import { booking } from "./booking.hono.ts";
import { google } from "./google.hono.ts";

export const app = new Hono().basePath("/api");

app.use("*", cors());
app.get("/", (c) => c.text("alive"));

app.route("", booking);
app.route("/google", google);
Deno.serve(app.fetch);
