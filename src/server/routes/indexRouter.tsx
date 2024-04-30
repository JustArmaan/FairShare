import express from "express";
import { renderToHtml } from "jsxte";
import { Home } from "../views/pages/Home";
import { TransactionsPage } from "../views/pages/transactions/transactions";
import { env } from "../../../env";
import { getTransactionsForUser } from "../services/transaction.service";

const router = express.Router();

router.get("/home", async (_, res) => {
  const html = renderToHtml(<Home />);
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  res.send(html);
});

router.get("/test", async (_, res) => {
  try {
    const transactions = await getTransactionsForUser(151);
    console.log(transactions);
    const html = renderToHtml(<Home />);
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/transactions", (_, res) => {
  console.log("/transactions route was called");
  const transactions = [
    { id: 1, type: "deposit", amount: 102 },
    { id: 2, type: "withdrawal", amount: 50 },
  ];

  res.json(transactions);
});

export const indexRouter = router;
