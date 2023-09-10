import { Status } from "https://deno.land/std@0.201.0/http/http_status.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const urls = new Map<string, string>();

const router = new Router();
router
  .post("/", (context) => {
    const target = "";
    urls.set(crypto.randomUUID(), target);
    context.response.status = Status.OK;
  })
  .get("/:id", (ctx) => {
    const id = ctx.params.id;
    if (!id || !urls.has(id)) {
      ctx.response.status = Status.NotFound;
      return;
    }
    const target = urls.get(id);
    ctx.response.status = Status.PermanentRedirect;
    ctx.response.headers.set("Location", target!);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3333 });
