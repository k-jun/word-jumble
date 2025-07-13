# Word Jumble

## run

以下のコマンドでサーバーを起動します。

```bash
PORT=8080 deno run --allow-net --allow-read --allow-env src/main.js
```

以下のコマンドで `./words.txt` を最新の状態へ更新します。

```bash
deno run -A processor.ts     
```

## test

```bash
deno -A test
```

<!-- winter-aconite -->
