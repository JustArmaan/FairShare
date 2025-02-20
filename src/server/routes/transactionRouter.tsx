import express from "express";
import { renderToHtml } from "jsxte";
import TransactionDetailsPage from "../views/pages/transactions/TransactionDetails";
import {
  getTransaction,
  getTransactionLocation,
  getTransactionsForUser,
  searchTransactions,
  getTransactionsByMonth,
  createTransaction,
  getCashAccountForUser,
  createCashAccount,
} from "../services/transaction.service";

import Transaction from "../views/pages/transactions/components/Transaction";
import TransactionsPage from "../views/pages/transactions/TransactionPage";
import { getUser } from "./authRouter";
import { env } from "../../../env";
import {
  getAccountWithTransactions,
  getAccountsForUser,
  getItem,
  getItemsForUser,
} from "../services/plaid.service";
import { TransactionList } from "../views/pages/transactions/components/TransactionList";
import { AccountPickerForm } from "../views/pages/transactions/components/AccountPickerForm";
import {
  addTransactionsToGroup,
  deleteTransactionFromGroup,
  getCategories,
  getGroupTransactionStateId,
  getGroupWithMembers,
  getTransactionsToGroup,
  getUsersToGroup,
} from "../services/group.service";
import {
  createGroupTransactionState,
  createOwed,
  getAllGroupTransactionStatesFromGroupId,
  getAllOwedForGroupTransaction,
  getGroupTransactionDetails,
  getOwedStatusIdFromName,
  getOwedStatusNameFromId,
} from "../services/owed.service";
import {
  getAccountTypeIdByName,
  getAccountTypeById,
} from "../services/accountType.service";
import {
  addAccount,
  getAccount,
  getItemFromAccountId,
} from "../services/account.service";
import { CreateTransaction } from "../views/pages/Groups/components/ManualAdd";
import { findUser } from "../services/user.service";
import { v4 as uuid } from "uuid";
import { ViewBillSplitPage } from "../views/pages/Groups/ViewBillSplitPage";

const router = express.Router();

router.get("/accountPicker/:itemId/:accountId", getUser, async (req, res) => {
  const accounts = await getAccountsForUser(req.user!.id, req.params.itemId);

  if (!accounts) throw new Error("Missing accounts for user");

  const item = await getItemFromAccountId(req.params.accountId);

  if (!item) throw new Error("Missing item for account");

  const html = renderToHtml(
    <AccountPickerForm
      accounts={accounts}
      selectedAccountId={req.params.accountId}
      itemId={item.item.id}
    />
  );
  res.send(html);
});

router.get("/transactionList", getUser, async (req, res) => {
  const items = await getItemsForUser(req.user!.id);
  const accounts = await getAccountsForUser(req.user!.id, items[0].item.id);
  if (!accounts) throw new Error("404");
  const html = renderToHtml(
    <div
      hx-get={`/transactions/page/${items[0].item.id}/${accounts[0].id}`}
      hx-swap="innerHTML"
      hx-trigger="load"
      hx-target="#app"
    ></div>
  );
  res.send(html);
});

router.get("/transactionList/:accountId", getUser, async (req, res) => {
  const account = await getAccountWithTransactions(req.params.accountId);
  if (!account) throw new Error("404");
  const html = renderToHtml(<TransactionList account={account} />);
  res.send(html);
});

router.get("/page/:itemId/:selectedAccountId", getUser, async (req, res) => {
  try {
    const accounts = await getAccountsForUser(req.user!.id, req.params.itemId);
    if (!accounts) throw new Error("no accounts for user!");

    const allTransactions = await getAccountWithTransactions(
      req.params.selectedAccountId
    );

    const uniqueYearMonth = new Set();

    allTransactions?.transactions?.map((transaction) => {
      const date = new Date(transaction.timestamp as string);
      const yearMonth = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}`;
      uniqueYearMonth.add(yearMonth);
    });

    const html = renderToHtml(
      <TransactionsPage
        accounts={await Promise.all(
          // this is ugly as shit, quick fix cuz i'm tired
          accounts.map(
            async (account) => (await getAccountWithTransactions(account.id))!
          )
        )}
        selectedAccountId={req.params.selectedAccountId}
        itemId={req.params.itemId}
        uniqueYearMonth={Array.from(uniqueYearMonth) as string[]}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.get("/details/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransaction(transactionId);
    const account = await getAccount(transaction.accountId);
    const url = req.query.url as string;
    if (!transaction || !account) return res.status(404).send("404");

    const accountType = await getAccountTypeById(
      account.accountTypeId ? account.accountTypeId : "Unknown"
    );

    const item = await getItem(account.itemId);
    if (!item) return res.status(404).send("404");
    const info = await getItemsForUser(req.user!.id);

    const html = renderToHtml(
      <TransactionDetailsPage
        transaction={transaction}
        accountType={accountType ? accountType : "Unknown"}
        institution={item.institutionName ? item.institutionName : "Unknown"}
        info={info[0] ? info : []}
        url={url}
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
  }
});

router.post("/search/:selectedAccountId", getUser, async (req, res) => {
  try {
    const query = req.body.search;
    const accountId = req.params.selectedAccountId;
    const transactions = await searchTransactions(accountId, query);

    const html = renderToHtml(
      <div>
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
          />
        ))}
      </div>
    );

    res.send(html);
  } catch (error) {
    console.error("Error searching transactions:", error);
    res.status(500).send("Error searching transactions");
  }
});

router.post("/date/:selectedAcoountId", getUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    const accountId = req.params.selectedAcoountId;
    let month = req.body.month;
    const year = req.body.year;
    const reset = req.body.reset;

    let transactions;

    if (reset) {
      transactions = await getTransactionsForUser(userId, 999999);
    }

    month = month.padStart(2, "0");

    transactions = await getTransactionsByMonth(accountId, year, month);

    const html = renderToHtml(
      <div>
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
          />
        ))}
      </div>
    );

    res.send(html);
  } catch (error) {
    console.error("Error getting transactions by month:", error);
    res.status(500).send("Error getting transactions by month");
  }
});

router.get("/location/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await getTransactionLocation(transactionId);

    if (!transaction) return res.status(404).send("404");

    const location = {
      lat: transaction.latitude,
      lng: transaction.longitude,
    };

    res.json(location);
  } catch (error) {
    console.error(error);
  }
});

router.post("/addButton", async (req, res) => {
  const { checked, transactionId, groupId } = req.query as {
    [key: string]: string;
  };

  const transaction = await getTransaction(transactionId);
  // add/remove the transaction to group relationship

  const { members } = (await getGroupWithMembers(groupId))!;
  const membersNoInvited = members.filter(
    (member) => member.type !== "Invited"
  );
  if (checked === "false") {
    const groupTransactions = await addTransactionsToGroup(
      transaction.id,
      groupId
    );
    if (!groupTransactions) throw new Error();

    const groupTransactionState = await createGroupTransactionState({
      pending: false,
      groupTransactionId: groupTransactions[0].id,
    });
    const owedPerMember = transaction.amount / membersNoInvited.length;
    await Promise.all(
      membersNoInvited.map(async (member) => {
        return await createOwed({
          linkedTransactionId:
            member.id === req.user!.id ? transactionId : null,
          groupTransactionToUsersToGroupsStatusId:
            await getOwedStatusIdFromName("notSent"),
          usersToGroupsId: (await getUsersToGroup(groupId, member.id))!.id,
          groupTransactionStateId: groupTransactionState![0].id,
          amount:
            member.id === req.user!.id
              ? owedPerMember * (membersNoInvited.length - 1)
              : -1 * owedPerMember,
        });
      })
    );
  } else if (checked === "true") {
    const allTransactions = await getAllOwedForGroupTransaction(
      groupId,
      transaction.id
    );
    if (allTransactions!.some((transaction) => transaction.amount === 0)) {
      return res
        .status(400)
        .send("You can't remove a transaction that is being settled");
    } else {
      await deleteTransactionFromGroup(transaction.id, groupId as string);
    }
  }

  const html = renderToHtml(
    <Transaction
      tailwindColorClass={transaction.category.color}
      transaction={transaction}
      checked={!(checked === "true")}
      route="AddTransaction"
      groupId={groupId as string}
    />
  );
  res.send(html);
});

router.get("transaction/:transactionId", async (req, res) => {
  const transaction = await getTransaction(req.params.transactionId);
  if (!transaction) return res.status(404).send("404");

  const html = renderToHtml(
    <Transaction
      transaction={transaction}
      tailwindColorClass={transaction.category.color}
    />
  );
  res.send(html);
});

router.get("/account/:accountId", async (req, res) => {
  const accountId = req.params.accountId;
});

router.get("/createTransaction/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { id } = req.user!;
    let databaseUser = await findUser(id);
    if (!databaseUser) throw new Error("failed to create user");

    const categories = await getCategories();
    if (!categories) throw new Error("No categories found");

    const html = renderToHtml(
      <CreateTransaction
        icons={categories}
        currentUser={{ ...databaseUser, type: "Owner" }}
        groupId={groupId}
      />
    );
    res.send(html);
  } catch (error) {
    console.error("Error loading create transaction page", error);
    res.status(500).send("Error loading create transaction page");
  }
});

router.post("/createTransaction/:groupId", async (req, res) => {
  try {
    const { id } = req.user!;

    const currentUser = await findUser(id);

    if (!currentUser) {
      return res.status(500).send("Failed to get user");
    }

    const { transactionName, transactionAmount, selectedCategoryId } = req.body;

    if (
      !transactionName ||
      transactionName === "" ||
      !transactionAmount ||
      transactionAmount === "" ||
      !selectedCategoryId ||
      selectedCategoryId === ""
    ) {
      return res.status(400).send("Please fill out all fields.");
    }

    if (!selectedCategoryId) {
      return res.status(400).send("Category not found.");
    }

    const groupId = req.params.groupId;

    const getCashAccount = await getCashAccountForUser(id);

    if (!getCashAccount) {
      const accountType = await getAccountTypeIdByName("cash");
      const newAccount = await addAccount({
        id: uuid(),
        name: "Cash Account",
        accountTypeId: accountType!.id,
        currencyCodeId: null,
      });
      await createCashAccount({ userId: id, account_id: newAccount!.id });
    }

    const cashAccount = await getCashAccountForUser(id);
    if (!cashAccount) {
      return res.status(500).send("No cash account found");
    }

    await createTransaction({
      accountId: cashAccount.account_id,
      amount: transactionAmount,
      company: transactionName,
      categoryId: selectedCategoryId,
      timestamp: new Date().toISOString(),
      address: null,
      latitude: null,
      longitude: null,
      pending: false,
    });

    const html = renderToHtml(
      <div
        hx-get={`/groups/addTransaction/${cashAccount.account_id}/${groupId}`}
        hx-swap="innerHTML"
        hx-trigger="load"
        hx-target="#app"
      />
    );
    res.send(html);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while creating a transaction.");
  }
});

router.get("/viewBillSplit/:transactionId/:groupId", async (req, res) => {
  const groupWithMembers = await getGroupWithMembers(req.params.groupId);
  const currentUser = await findUser(req.user!.id);

  if (!currentUser) throw new Error("404");

  const transactionDetails = {
    companyName: "Guu Thurlow",
    address: "838 Thurlow St, Vancouver",
    date: "March 28, 2024 16:04",
    transactionId: "ID123456321",
  };

  const itemizedTransaction = [
    {
      item: "Ebi Mayo",
      quantity: 1,
      price: 16.0,
      owingMembers: [
        groupWithMembers?.members[0],
        groupWithMembers?.members[1],
      ],
    },
    {
      item: "Asahi Pitcher",
      quantity: 1,
      price: 22.0,
      owingMembers: [groupWithMembers?.members[0]],
    },
    {
      item: "Katsu Curry",
      quantity: 1,
      price: 20.0,
      owingMembers: [groupWithMembers?.members[1]],
    },
    {
      item: "Beef Yakisoba",
      quantity: 1,
      price: 21.0,
      owingMembers: [
        groupWithMembers?.members[0],
        groupWithMembers?.members[1],
      ],
    },
    {
      item: "AAA BBQ Beef",
      quantity: 1,
      price: 26.5,
      owingMembers: [groupWithMembers?.members[0]],
    },
    {
      item: "Oolong Tea",
      quantity: 1,
      price: 2.5,
      owingMembers: [groupWithMembers?.members[1]],
    },
  ];

  if (!groupWithMembers || !groupWithMembers.members) throw new Error("404");

  const owedPerMember = groupWithMembers.members.map((member) => {
    return {
      member,
      totalOwed: itemizedTransaction.reduce((sum, item) => {
        if (
          item.owingMembers.some((owingMember) => owingMember?.id === member.id)
        ) {
          return sum + item.price / item.owingMembers.length;
        }
        return sum;
      }, 0),
    };
  });

  const groupTransactionStates = await getAllGroupTransactionStatesFromGroupId(
    req.params.groupId
  );
  const results = await Promise.all(
    groupTransactionStates.map(
      async (result) =>
        (await getGroupTransactionDetails(result.groupTransactionState.id))!
    )
  );

  const html = renderToHtml(
    <ViewBillSplitPage
      currentUser={currentUser}
      groupWithMembers={groupWithMembers}
      transactionDetails={transactionDetails}
      receiptItems={itemizedTransaction}
      owedPerMember={owedPerMember} // Pass the new array to the component
      resultPerGroupTransaction={results}
    />
  );
  res.send(html);
});

export const transactionRouter = router;
