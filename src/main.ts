import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { process as batchProcess } from "../batch/main.ts";

const INPUT_PATH = Deno.env.get("INPUT_PATH") ?? "./words.txt";

// words.txt が存在しない場合は batch を実行して生成
try {
  await Deno.stat(INPUT_PATH);
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    const info1 = new TextEncoder().encode(
      `[INFO] ${INPUT_PATH} not found. Running batch process...\n`,
    );
    await Deno.stderr.write(info1);
    await batchProcess();
    const info2 = new TextEncoder().encode(
      `[INFO] Batch process completed. ${INPUT_PATH} created.\n`,
    );
    await Deno.stderr.write(info2);
  } else {
    throw error;
  }
}

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
