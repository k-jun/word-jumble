import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { process } from "../batch/main.ts";

const WORDS_PATH = Deno.env.get("WORDS_PATH") ?? "./words.txt";

async function ensureWordsFile(): Promise<void> {
  await Deno.stdout.write(new TextEncoder().encode(`[startup] Checking WORDS_PATH: ${WORDS_PATH}\n`));
  try {
    await Deno.stat(WORDS_PATH);
    await Deno.stdout.write(new TextEncoder().encode(`[startup] WORDS_PATH already exists. Skipping batch process.\n`));
  } catch {
    await Deno.stdout.write(new TextEncoder().encode(`[startup] WORDS_PATH not found. Running batch process...\n`));
    await process();
    await Deno.stdout.write(new TextEncoder().encode(`[startup] Batch process completed. WORDS_PATH is ready.\n`));
  }
}

await ensureWordsFile();

const text = await Deno.readTextFile(WORDS_PATH);
let words = text.split("\n");

setInterval(async () => {
  const text = await Deno.readTextFile(WORDS_PATH);
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
