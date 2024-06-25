import express from "express";
import { renderToHtml } from "jsxte";
import { getTransactionsForUser } from "../services/transaction.service";
import {
  getAccountWithCurrentMonthTransactions,
  getAccountWithTransactions,
  getAccountsForUser,
  getCashAccountForUser,
  getCashAccountWithTransaction,
  getItem,
  getItemsForUser,
  getPlaidAccountsForUser,
} from "../services/plaid.service";
import MyAccountsPage from "../views/pages/transactions/MyAccountsPage";
import { AccountOverview } from "../views/pages/transactions/components/AccountOverview";
import { ConnectAccount } from "../views/pages/transactions/components/ConnectAccount";
import { ItemPickerForm } from "../views/pages/transactions/components/ItemPickerForm";
import { getCurrentMonthTransactions } from "../utils/currentMonthTransactions";
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
      res.send(html);
      return;
    } else {
      const html = renderToHtml(<ConnectAccount />);
      res.send(html);
      return;
    }
  }

  const cashAccount = await getCashAccountForUser(userId);
  const accounts = await getAccountsForUser(userId, req.params.itemId);

  // await syncTransactionsForUser(userId); // no need to do this anymore ?

  const accountsWithTransactions = await Promise.all(
    accounts!.map(async (account) => {
      return {
        ...account,
        transactions: await getCurrentMonthTransactions(account.id),
      };
    })
  );
  const sortedAccounts = accountsWithTransactions.sort((a, b) => {
    return (b.transactions.length || 0) - (a.transactions.length || 0);
  });
  console.log(req.params.itemId);
  // throw new Error("test");
  const selectedItem = await getItem(req.params.itemId);
  // This will now get the account with the most transactions first to display nicer graphs
  const html = renderToHtml(
    <MyAccountsPage
      accountIds={sortedAccounts.map((account) => account.id)}
      selectedItemId={req.params.itemId}
      selectedItem={selectedItem!}
      username={req.user!.firstName}
      cashAccount={cashAccount}
    />
  );

  res.send(html);
});

router.get("/itemPicker/:itemId", async (req, res) => {
  try {
    const userId = req.user!.id;
    const results = await getItemsForUser(userId);
    const { groupId } = req.query;

    if (!results) {
      throw new Error("Missing accounts for user");
    }

    const html = renderToHtml(
      <ItemPickerForm
        items={results.map((result) => result.item)}
        selectedItemId={req.params.itemId}
        groupId={groupId as string | undefined}
      />
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});

router.get("/accountOverview/:accountId", async (req, res) => {
  const accountWithTransactions = await getAccountWithCurrentMonthTransactions(
    req.params.accountId
  );

  if (!accountWithTransactions) {
    return;
  }
  const html = renderToHtml(
    <AccountOverview account={accountWithTransactions!} />
  );
  res.send(html);
});

router.get("/accountOverview/cashAccount/:cashAccountId", async (req, res) => {
  const cashAccount = await getCashAccountWithTransaction(
    req.params.cashAccountId
  );

  const account = {
    ...cashAccount!,
    accountTypeId: "cash",
    balance: "0",
    itemId: "",
  };

  const html = renderToHtml(<AccountOverview account={account} />);
  res.send(html);
});

export const homeRouter = router;
