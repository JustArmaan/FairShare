import express from "express";
import { renderToHtml } from "jsxte";
import { Home } from "../views/pages/Home";
import { TransactionsPage } from "../views/pages/transactions/transactions";
import { env } from "../../../env";
import { getTransactionsForUser } from "../services/transaction.service";
import { text } from "stream/consumers";
import type { tr } from "@faker-js/faker";
import { }

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
    const cardHtml = {
      bankLogo: "/cardAssets/scotiabank.svg",
      bankName: "ScotiaBank",
      cardNumber: "8763 2736 9873 ****",
      cardHolder: "John Doe",
      expiryDate: "10/28",
      primaryColor: "primary-red",
      textColor: "font-off-white",
      accentColor1: "accent-yellow",
      accentColor2: "accent-red",
    };

    const transactions = await getTransactionsForUser(151);
    const mappedTransactions = transactions.map((item) => {
      return {
        ...item.transactions,
        category: item.categories,
      };
    });

    const html = renderToHtml(
      <TransactionsPage
        transactions={mappedTransactions}
        cardDetails={cardHtml}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/header", (req, res) => {
  try {
    const html = renderToHtml(<)
  } catch (err) {
    console.error(err)
  }
})

router.get("/transactions", (_, res) => {
  console.log("/transactions route was called");
  const transactions = [
    { id: 1, type: "deposit", amount: 102 },
    { id: 2, type: "withdrawal", amount: 50 },
  ];

  res.json(transactions);
});

export const indexRouter = router;
