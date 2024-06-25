import express from "express";
import { renderToHtml } from "jsxte";
import { BreakdownPage } from "../views/pages/Breakdown/BreakdownPage";
import { getUser } from "./authRouter";
import {
  getAccountWithCurrentMonthTransactions,
  getAccountWithMonthTransactions,
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
  if (!result) throw new Error("404");
  const html = renderToHtml(
    <BreakdownPage
      transactions={result.transactions}
      accountName={result.name}
      accountId={req.params.accountId}
      month={Number(month) || undefined}
      year={Number(year) || undefined}
      url={`/breakdown/page/${req.params.accountId}`}
    />
  );

  res.send(html);
});

export const breakdownRouter = router;
