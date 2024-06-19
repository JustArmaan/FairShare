import express from "express";
import { renderToHtml } from "jsxte";
import { getTransactionsForUser } from "../services/transaction.service";
import { syncTransactionsForUser } from "../integrations/plaid/sync";
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getItemsForUser,
} from "../services/plaid.service";
import MyAccountsPage from "../views/pages/transactions/MyAccountsPage";
import { AccountOverview } from "../views/pages/transactions/components/AccountOverview";
import { ConnectAccount } from "../views/pages/transactions/components/ConnectAccount";
import { ItemPickerForm } from "../views/pages/transactions/components/ItemPickerForm";
const router = express.Router();

router.get("/page/:itemId", async (req, res, next) => {
  const userId = req.user!.id;
  if (req.params.itemId === "default") {
    const items = await getItemsForUser(req.user!.id);
    const defaultItem = items[0] && items[0].item;
    if (defaultItem) {
      const html = renderToHtml(
        <div
          hx-get={`/home/page/${defaultItem.id}`}
          hx-trigger="load"
          hx-target="#app"
          hx-swap="innerHTML"
        />
      );

      return res.send(html);
    } else {
      const html = renderToHtml(<ConnectAccount />);
      res.send(html);
      return;
    }
  }
  const accounts = await getAccountsForUser(userId, req.params.itemId);

  // await syncTransactionsForUser(userId); // no need to do this anymore ?

  const accountsWithTransactions = await Promise.all(
    accounts!.map(async (account) => {
      return {
        ...account,
        transactions: await getTransactionsForUser(account.id),
      };
    })
  );
  const sortedAccounts = accountsWithTransactions.sort((a, b) => {
    return (b.transactions.length || 0) - (a.transactions.length || 0);
  });

  // This will now get the account with the most transactions first to display nicer graphs
  const html = renderToHtml(
    <MyAccountsPage
      accountIds={sortedAccounts.map((account) => account.id)}
      selectedItemId={req.params.itemId}
      username={req.user!.firstName}
    />
  );

  res.send(html);
});

router.get("/itemPicker/:itemId", async (req, res) => {
  const results = await getItemsForUser(req.user!.id);
  if (!results) throw new Error("Missing accounts for user");
  const html = renderToHtml(
    <ItemPickerForm
      items={results.map((result) => result.item)}
      selectedItemId={req.params.itemId}
    />
  );
  res.send(html);
});

router.get("/accountOverview/:accountId", async (req, res) => {
  const accountWithTransactions = await getAccountWithTransactions(
    req.params.accountId
  );
  const html = renderToHtml(
    <AccountOverview account={accountWithTransactions!} />
  );
  res.send(html);
});

export const homeRouter = router;
