import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const INPUT_PATH = Deno.env.get("INPUT_PATH") ?? "./words.txt";
const text = await Deno.readTextFile(INPUT_PATH);
let words = text.split("\n");

setInterval(async () => {
  const text = await Deno.readTextFile(INPUT_PATH);
  words = text.split("\n");
}, 10 * 60 * 1000);

const main = (): void => {
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
    const rw = new Set<string>();
    while (rw.size < Math.min(1000, words.length)) {
      rw.add(words[Math.floor(Math.random() * words.length)]);
    }

    ctx.response.body = JSON.stringify(Array.from(rw));
  });
  app.use(router.routes());
  app.listen({ port: Number(Deno.env.get("PORT") ?? 8080) });
};

if (import.meta.main) {
  main();
}
