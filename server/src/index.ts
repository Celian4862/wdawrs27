import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia");

if (import.meta.main) {
  app.listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
}

export default app;
