// import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
// import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const WORDFILE_PATH = Deno.env.get("WORDFILE_PATH") ?? "./words.txt";
const text = await Deno.readTextFile(WORDFILE_PATH);
const words = text.split("\n");

function main(): void {
  const app = new Application();

  app.use(async (context, next) => {
    try {
      await context.send({
        root: `${Deno.cwd()}/static`,
        index: "index.html",
      });
    } catch {
      await next();
    }
  });

  const router = new Router();
  router.get("/api/words", (ctx) => {
    const rw = [];
    for (let i = 0; i < 1000; i++) {
      rw.push(words[Math.floor(Math.random() * words.length)]);
    }

    ctx.response.body = JSON.stringify(rw);
  });
  app.use(router.routes());
  app.listen({ port: Number(Deno.env.get("PORT") ?? 8080) });
}

main();
