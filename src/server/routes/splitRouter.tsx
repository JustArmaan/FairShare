import express from "express";
import { renderToHtml } from "jsxte";
import { SplitDetails } from "../views/pages/Splitting/SplitDetails";
import {
  getGroupTransactionDetails,
  getGroupTransactionStateIdFromOwedId,
} from "../services/owed.service";
import { SettleSplit } from "../views/pages/Splitting/SettleSplit";
import {
  getItemsWithAllTransactions,
  getItemWithAllTransactions,
} from "../services/transaction.service";
import { LinkTransfer } from "../views/pages/Splitting/components/LinkTransfer";
import { TransactionSelector } from "../views/pages/Splitting/components/TransactionSelector";
import { LinkTransferDropdownButton } from "../views/pages/Splitting/components/LinkTransferDropdownButton";

const router = express.Router();

router.get("/view", async (req, res) => {
  const { owedId, groupId } = req.query as { [key: string]: string };
  const user = req.user!;

  const details = await getGroupTransactionStateIdFromOwedId(owedId);
  console.log(details, "here");
  const results = await getGroupTransactionDetails(
    details!.groupTransactionState.id
  );
  console.log(details);

  if (!results) throw new Error("no results");

  const transactionOwner = results.find(
    (transaction) => transaction.groupTransactionToUsersToGroups.amount > 0
  )!.users;

  const userTransaction = results.find(
    (transaction) => transaction.users.id === user.id
  );
  const isOwing =
    userTransaction?.transactions.amount &&
    userTransaction?.transactions.amount < 0;

  const amountOwed =
    (isOwing
      ? userTransaction!.transactions.amount
      : results
          .filter((result) => result.users.id !== user.id)
          .reduce(
            (acc, result) =>
              acc + result.groupTransactionToUsersToGroups.amount,
            0
          )) * -1;

  const html = renderToHtml(
    <SplitDetails
      transaction={results[0].transactions!}
      transactionOwner={transactionOwner}
      currentUser={user}
      amountOwed={amountOwed}
      linkedTransactionAccountName="Scotiabank Visa ***4" // hard coded
      pending={false} // hard coded
      groupId={groupId}
      owedId={owedId}
    />
  );

  res.send(html);
});

router.get("/settle", async (req, res) => {
  const { owedId, groupId } = req.query as {
    [key: string]: string;
  };

  const user = req.user!;

  const details = await getGroupTransactionStateIdFromOwedId(owedId);
  const results = await getGroupTransactionDetails(
    details!.groupTransactionState.id
  );

  if (!results) throw new Error("no results");

  const transactionOwner = results.find(
    (transaction) => transaction.groupTransactionToUsersToGroups.amount > 0
  )!.users;

  const userTransaction = results.find(
    (transaction) => transaction.users.id === user.id
  );
  const isOwing =
    userTransaction?.transactions.amount &&
    userTransaction?.transactions.amount < 0;

  const amountOwed =
    (isOwing
      ? userTransaction!.transactions.amount
      : results
          .filter((result) => result.users.id !== user.id)
          .reduce(
            (acc, result) =>
              acc + result.groupTransactionToUsersToGroups.amount,
            0
          )) * -1;

  const html = renderToHtml(
    <SettleSplit
      transaction={results[0].transactions!}
      transactionOwner={transactionOwner}
      currentUser={user}
      amountOwed={amountOwed}
      linkedTransactionAccountName="Scotiabank Visa ***4" // hard coded
      pending={false} // hard coded
      groupId={groupId}
      owedId={owedId}
    />
  );

  res.send(html);
});

router.get("/splitController/:itemId", async (req, res) => {
  const { user } = req;
  const { itemId } = req.params;

  const items = await getItemsWithAllTransactions(user!.id);

  const html = renderToHtml(
    <LinkTransfer items={items!} selectedItemId={itemId} />
  );
  res.send(html);
});

router.get("/transactionSelector", async (req, res) => {
  const { transactionId, itemId } = req.query as { [key: string]: string };

  const result = (await getItemWithAllTransactions(itemId))!;

  const html = renderToHtml(
    <TransactionSelector
      itemWithTransactions={result}
      selectedTransactionId={transactionId === "default" ? null : transactionId}
    />
  );
  res.send(html);
});

router.get("/linkTransferComponent", async (req, res) => {
  const { open } = req.query as { [key: string]: string };

  const html = renderToHtml(
    <LinkTransferDropdownButton open={open === "true"} />
  );
  res.send(html);
});

export const splitRouter = router;
