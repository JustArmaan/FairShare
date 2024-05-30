import express from "express";
import { renderToHtml } from "jsxte";
import { getTransactionsForUser } from "../services/transaction.service";
import { syncTransactionsForUser } from "../integrations/plaid/sync";
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getCashAccountForUser,
  getCashAccountWithTransaction,
} from "../services/plaid.service";
import MyAccountsPage from "../views/pages/transactions/MyAccountsPage";
import { AccountOverview } from "../views/pages/transactions/components/AccountOverview";
import { ConnectAccount } from "../views/pages/transactions/components/ConnectAccount";
const router = express.Router();

router.get("/page", async (req, res) => {
  const userId = req.user!.id;

  await syncTransactionsForUser(userId);
  const accounts = await getAccountsForUser(userId);
  const cashAccount = await getCashAccountForUser(userId);
  console.log(cashAccount, "cashAccount");
  if (!accounts || accounts.length === 0) {
    const html = renderToHtml(<ConnectAccount />);
    res.send(html);
    return;
  }

  const accountsWithTransactions = await Promise.all(
    accounts.map(async (account) => {
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
      selectedAccountId={""}
      username={req.user!.firstName}
      cashAccount={cashAccount}
    />
  );

  res.send(html);
});

/*
router.get('/itemPicker/:itemId', async (req, res) => {
  const results = await getItemsForUser(req.user!.id);
  if (!results) throw new Error('Missing accounts for user');
  const html = renderToHtml(
    <ItemPickerForm
      items={results.map((result) => result.item)}
      selectedAccountId={req.params.accountId}
    />
  );
  res.send(html);
});
*/

router.get("/accountOverview/account/:accountId", async (req, res) => {
  const accountWithTransactions = await getAccountWithTransactions(
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
    ...cashAccount,
    accountTypeId: "cash",
    balance: 0,
    itemId: "",
  };

  const html = renderToHtml(<AccountOverview account={account} />);
  res.send(html);
});

export const homeRouter = router;
