import express from "express";
import { renderToHtml } from "jsxte";
import { SplitDetails } from "../views/pages/Splitting/SplitDetails";
import {
  getGroupTransactionDetails,
  getGroupTransactionStateIdFromOwedId,
  getOwed,
  getOwedStatusNameFromId,
  getTransactionOwnerFromOwedId,
  updateOwedAmount,
  updateOwedStatus,
} from "../services/owed.service";
import { SettleSplit } from "../views/pages/Splitting/SettleSplit";
import {
  createTransaction,
  getItemsWithAllTransactions,
  getItemWithAllTransactions,
} from "../services/transaction.service";
import { LinkTransfer } from "../views/pages/Splitting/components/LinkTransfer";
import { TransactionSelector } from "../views/pages/Splitting/components/TransactionSelector";
import { LinkTransferDropdownButton } from "../views/pages/Splitting/components/LinkTransferDropdownButton";
import { getOrCreateCashAccountForUser } from "../utils/getOrCreateCashAccount";
import { getCategoryIdByName } from "../services/category.service";
import {
  getGroupByOwedId,
  getGroupIdFromOwed,
} from "../services/group.service";
import type { OwedStatus } from "../database/seed";
import {
  getAccount,
  getAccountIdByTransactionId,
} from "../services/account.service";

const router = express.Router();

router.get("/view", async (req, res) => {
  const { owedId, groupId } = req.query as { [key: string]: string };
  const user = req.user!;

  const details = await getGroupTransactionStateIdFromOwedId(owedId);
  const results = await getGroupTransactionDetails(
    details!.groupTransactionState.id
  );

  if (!results) throw new Error("no results");

  const transactionOwner =
    results.find(
      (transaction) => transaction.groupTransactionToUsersToGroups.amount > 0
    )?.users ?? (await getTransactionOwnerFromOwedId(owedId));

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

  const userOwedStatus = details!.groupTransactionToUsersToGroupsStatus.status;

  let linkedAccountName: string | undefined;
  if (userTransaction?.groupTransactionToUsersToGroups.linkedTransactionId) {
    const accountId = await getAccountIdByTransactionId(
      userTransaction.groupTransactionToUsersToGroups.linkedTransactionId
    );
    const account = await getAccount(accountId);
    linkedAccountName = account!.name;
  }

  const html = renderToHtml(
    <SplitDetails
      transaction={results[0].transactions!}
      transactionOwner={transactionOwner}
      currentUser={user}
      amountOwed={amountOwed}
      linkedTransactionAccountName={linkedAccountName}
      pending={false} // hard coded
      groupId={groupId}
      owedId={owedId}
      owedStatus={userOwedStatus as OwedStatus[number]}
      results={results}
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

  const userOwedStatusId =
    details!.groupTransactionToUsersToGroups
      .groupTransactionToUsersToGroupsStatusId;

  let linkedAccountName: string | undefined;
  if (userTransaction?.groupTransactionToUsersToGroups.linkedTransactionId) {
    const accountId = await getAccountIdByTransactionId(
      userTransaction.groupTransactionToUsersToGroups.linkedTransactionId
    );
    const account = await getAccount(accountId);
    linkedAccountName = account!.name;
  }

  const userOwedStatus = await getOwedStatusNameFromId(userOwedStatusId);

  const html = renderToHtml(
    <SettleSplit
      transaction={results[0].transactions!}
      transactionOwner={transactionOwner}
      currentUser={user}
      amountOwed={amountOwed}
      linkedTransactionAccountName={linkedAccountName}
      // pending={false} // hard coded
      groupId={groupId}
      owedId={owedId}
      results={results}
      owedStatus={userOwedStatus}
    />
  );

  res.send(html);
});

router.get("/splitController/:itemId", async (req, res) => {
  const { user } = req;
  const { itemId } = req.params;
  const { owedAmount, owedId } = req.query as { [key: string]: string };

  const items = await getItemsWithAllTransactions(user!.id);

  const html = renderToHtml(
    <LinkTransfer
      items={items!}
      selectedItemId={itemId}
      owedAmount={parseFloat(owedAmount)}
      owedId={owedId}
    />
  );
  res.send(html);
});

router.get("/transactionSelector", async (req, res) => {
  const { transactionId, itemId, owedAmount, owedId } = req.query as {
    [key: string]: string;
  };

  const result = (await getItemWithAllTransactions(itemId))!;

  const html = renderToHtml(
    <TransactionSelector
      itemWithTransactions={result}
      selectedTransactionId={transactionId === "default" ? null : transactionId}
      owedAmount={parseFloat(owedAmount)}
      owedId={owedId}
    />
  );
  res.send(html);
});

router.get("/linkTransferComponent", async (req, res) => {
  const { open, owedAmount, owedId } = req.query as { [key: string]: string };

  const html = renderToHtml(
    <LinkTransferDropdownButton
      open={open === "true"}
      owedAmount={parseFloat(owedAmount)}
      owedId={owedId}
    />
  );
  res.send(html);
});

// settleType is one of: cash, transaction, none
router.post("/settle", async (req, res) => {
  const { type, owedId } = req.body;
  const user = req.user!;
  let linkedTransactionId: string | undefined;
  if (type === "cash") {
    const { amount } = req.body;
    // create new cash transaction
    const cashAcc = await getOrCreateCashAccountForUser(user.id);
    const transferOutCategoryId = (await getCategoryIdByName("TRANSFER_OUT"))!
      .id;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    linkedTransactionId = (await createTransaction({
      categoryId: transferOutCategoryId,
      timestamp: formattedDate,
      amount: parseFloat(amount),
      accountId: cashAcc!.account_id,
      company: "Cash Transfer",
      address: null,
      latitude: null,
      longitude: null,
      pending: null,
    }))!;
  } else if (type === "transaction") {
    const { transactionId } = req.body;
    linkedTransactionId = transactionId;
  }

  await updateOwedStatus(owedId, "awaitingConfirmation", linkedTransactionId);

  const groupId = (await getGroupByOwedId(owedId))!.id;

  const html = renderToHtml(
    <div
      hx-get={`/split/view?owedId=${owedId}&groupId=${groupId}`}
      hx-push-url={`/split/view?owedId=${owedId}&groupId=${groupId}`}
      hx-swap="innerHTML"
      hx-target="#app"
      hx-trigger="load"
    />
  );
  res.send(html);
});

router.post("/confirm", async (req, res) => {
  const { owedId } = req.body as {
    [key: string]: string;
  };

  const groupTransactionStateId = (await getGroupTransactionStateIdFromOwedId(
    owedId
  ))!.groupTransactionState.id;
  // confirm that the user is authorized
  const results = await getGroupTransactionDetails(groupTransactionStateId);

  const transactionOwner = results!.find(
    (result) => result.groupTransactionToUsersToGroups.amount > 0
  );

  if (req.user!.id !== transactionOwner!.users.id) {
    return res.status(404).send();
  }

  const owed = await getOwed(owedId);
  const state = await getOwedStatusNameFromId(
    owed!.groupTransactionToUsersToGroupsStatusId
  );
  if (state !== "awaitingConfirmation") {
    return res.status(400);
  }

  const settledAmount = owed!.amount;

  await updateOwedAmount(
    transactionOwner!.groupTransactionToUsersToGroups.id,
    transactionOwner!.groupTransactionToUsersToGroups.amount + settledAmount
  );
  await updateOwedAmount(owedId, 0);
  await updateOwedStatus(owedId, "confirmed");

  const groupId = await getGroupIdFromOwed(owedId);

  const redirect = `/groups/view/${groupId}`;

  const html = renderToHtml(
    <div
      hx-get={redirect}
      hx-push-url={redirect}
      hx-target="#app"
      hx-swap="innerHTML"
      hx-trigger="load"
    ></div>
  );
  return res.send(html);
});

export const groupSplitRouter = router;
