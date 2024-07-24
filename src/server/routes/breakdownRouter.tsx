import express from "express";
import { renderToHtml } from "jsxte";
import { BreakdownPage } from "../views/pages/Breakdown/BreakdownPage";
import { getUser } from "./authRouter";
import {
  getAccountWithCurrentMonthTransactions,
  getAccountWithMonthTransactions,
  getAccountWithTransactions,
  getCashAccountWithTransaction,
} from "../services/plaid.service";
import { getOrCreateCashAccountForUser } from "../utils/getOrCreateCashAccount";

const router = express.Router();

router.get("/page/:accountId", getUser, async (req, res) => {
  const { month, year } = req.query;
  let result;
  let allTransactions;
  let uniqueYearMonth = new Set();
  if (month && year) {
    result = await getAccountWithMonthTransactions(
      req.params.accountId,
      Number(year),
      Number(month)
    );
    allTransactions = await getAccountWithTransactions(req.params.accountId);
    allTransactions?.transactions?.map((transaction) => {
      const date = new Date(transaction.timestamp as string);
      const yearMonth = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}`;
      uniqueYearMonth.add(yearMonth);
    });
  } else {
    result = await getAccountWithCurrentMonthTransactions(req.params.accountId);
    allTransactions = await getAccountWithTransactions(req.params.accountId);
    allTransactions?.transactions?.map((transaction) => {
      const date = new Date(transaction.timestamp as string);
      const yearMonth = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}`;
      uniqueYearMonth.add(yearMonth);
    });
  }

  if (!result) {
    const cashAccount = await getOrCreateCashAccountForUser(req.user!.id);

    if (!cashAccount)
      throw new Error("There is a problem retrieving your cash account");
    result = await getCashAccountWithTransaction(cashAccount.account_id);
    allTransactions = result?.transactions;
    allTransactions?.map((transaction) => {
      const date = new Date(transaction.timestamp as string);
      const yearMonth = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}`;
      uniqueYearMonth.add(yearMonth);
    });
  }

  if (!result) throw new Error("404");

  const html = renderToHtml(
    <BreakdownPage
      // @ts-ignore
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
