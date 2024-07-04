import express from "express";
import { renderToHtml } from "jsxte";
import { BreakdownPage } from "../views/pages/Breakdown/BreakdownPage";
import { getUser } from "./authRouter";
import {
  getAccountWithCurrentMonthTransactions,
  getAccountWithMonthTransactions,
  getAccountWithTransactions,
} from "../services/plaid.service";

const router = express.Router();

router.get("/page/:accountId", getUser, async (req, res) => {
  const { month, year } = req.query;
  let result;
  if (month && year) {
    result = await getAccountWithMonthTransactions(
      req.params.accountId,
      Number(year),
      Number(month)
    );
  } else {
    result = await getAccountWithCurrentMonthTransactions(req.params.accountId);
  }

  const allTransactions = await getAccountWithTransactions(
    req.params.accountId
  );

  // if (allTransactions) {
  //   const sortedMonthlyTransactions = allTransactions.transactions.reduce(
  //     (acc, transaction) => {
  //       const keyArr = transaction.timestamp?.split("-");
  //       if (!keyArr) return acc;
  //       const key = `${keyArr[0]}-${keyArr[1]}`;
  //       if (!acc[key]) acc[key] = [];
  //       acc[key].push(transaction);
  //       return acc;
  //     }
  //   );
  // }

  const uniqueYearMonth = new Set();

  allTransactions?.transactions?.map((transaction) => {
    const date = new Date(transaction.timestamp as string);
    const yearMonth = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}`;
    uniqueYearMonth.add(yearMonth);
  });

  if (!result) throw new Error("404");
  const html = renderToHtml(
    <BreakdownPage
      transactions={result.transactions}
      accountName={result.name}
      accountId={req.params.accountId}
      month={Number(month) || undefined}
      year={Number(year) || undefined}
      url={`/breakdown/page/${req.params.accountId}`}
      uniqueYearMonth={Array.from(uniqueYearMonth) as string[]}
    />
  );

  res.send(html);
});

export const breakdownRouter = router;
