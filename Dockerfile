FROM denoland/deno:2.4.1

WORKDIR /app
COPY . .
RUN deno cache src/main.ts

USER deno
CMD ["run", "-A", "src/main.ts"]
