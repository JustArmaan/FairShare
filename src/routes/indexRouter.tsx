import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { Home } from "../pages/Home";

export const indexRouter = new Elysia()
  .get("/", () => <Home />)
  .post(
    "/test",
    ({ body }) => {
      body.password;
    },
    {
      body: t.Object({
        username: t.Number(),
        password: t.String(),
      }),
    }
  )
  .get("/transactions", () => {
    console.log("/transactions route was called");
    const transactions = [
      { id: 1, type: "deposit", amount: 100 },
      { id: 2, type: "withdrawal", amount: 50 },
    ];

    return transactions;
  });
