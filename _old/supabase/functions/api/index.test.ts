import { app } from "./index.ts";
import { assertEquals } from "std/assert/mod.ts";

Deno.test("GET /api", async () => {
  const response = await app.request("/api", { method: "GET" });
  assertEquals(response.status, 200);
});

Deno.test("POST /api/reject_booking", async () => {
  const response = await app.request(
    "/api/reject_booking",
    {
      method: "POST",
      body: JSON.stringify({
        bookingId: "1c47e130-bee0-4969-9813-e0ca4cbb9b19",
        reason: "asdf",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  assertEquals(response.status, 200);
});
