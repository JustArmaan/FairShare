import express from "express";
import { renderToHtml } from "jsxte";
import { BreakdownPage } from "../views/pages/Breakdown/BreakdownPage";
import {
  getTransactionsByMonth,
  getTransactionsForUser,
} from "../services/transaction.service";
import { getUser } from "./authRouter";
import {
  getAccountWithCurrentMonthTransactions,
  getAccountWithTransactions,
} from "../services/plaid.service";
import {
  mapTransactionsToCategories,
  generatePathStyles,
} from "../views/pages/Breakdown/BreakdownPage";
import { Graph } from "../views/pages/Breakdown/components/TotalExpenses/Graph";
import { BudgetCard } from "../views/pages/Breakdown/components/BudgetCard";

const router = express.Router();

router.get("/page/:accountId", getUser, async (req, res) => {
  const result = await getAccountWithCurrentMonthTransactions(
    req.params.accountId
  );
  if (!result) throw new Error("404");
  const html = renderToHtml(
    <BreakdownPage
      transactions={result.transactions}
      accountName={result.name}
    />
  );

  res.send(html);
});

router.post("/history", async (req, res) => {
  const { accountId, year, month } = req.body;
  const transactions = await getTransactionsByMonth(accountId, year, month);
  const categories = mapTransactionsToCategories(transactions);
  const pathStyles = generatePathStyles(categories);
  const html = renderToHtml(
    <>
      <div>
        <div class="flex flex-col items-center justify-center relative">
          <p class="text-3xl text-center mt-6 font-bold pl-2 pr-2">
            $
            {categories
              .reduce((sum, category) => category.cost + sum, 0)
              .toFixed(2)}
          </p>
          <div class="h-0.5 bg-font-grey rounded mt-0.5 w-full"></div>
        </div>
        {/*<p class="absolute right-0 text-sm text-font-grey">-20% from March</p>*/}
      </div>
      <Graph slices={pathStyles} />
      <div class="h-0.5 bg-primary-dark-grey rounded mt-12"></div>
      <div class="h-4"></div> {/* spacer cuz collapsing margins are the devil*/}
      {pathStyles.map((card) => {
        return (
          <BudgetCard
            clipPathStyle={card.clipPathStyle}
            tailwindColorClass={card.tailwindColorClass}
            title={card.title}
            percentage={card.percentage}
            totalCosts={card.totalCosts}
            transactions={transactions.filter(
              (transaction) => transaction.categoryId === card.categoryId
            )}
          />
        );
      })}
    </>
  );
  res.send(html);
});

export const breakdownRouter = router;
