import {
  addAccount,
  addPlaidAccount,
  getAccount,
  updatePlaidAccount,
} from "../../services/account.service";
import { getAccountTypeIdByName } from "../../services/accountType.service";
import { getCategoryIdByName } from "../../services/category.service";
import {
  createTransactions,
  deleteTransactions,
  updateTransaction,
} from "../../services/transaction.service";
import {
  getItemsForUser,
  updateItem,
  type Item,
} from "../../services/plaid.service";
import { plaidRequest } from "./link";
import { io } from "../../main";
import { v4 } from "uuid";

type StoreEntry = { timestamp: string; syncStore?: Set<string> };
type ItemEntry = {
  origin?: string;
  items: {
    id: string;
    timestamp: string;
    responses: { reqCursor: string | undefined; response: any }[];
  }[];
};

type SyncEntry = StoreEntry | ItemEntry;

const syncStore = new Set<string>();
const syncQueue = new Set<string>();

export async function syncTransactionsForUser(userId: string, origin?: string) {
  const entry: SyncEntry = { timestamp: new Date(Date.now()).toLocaleString() };
  if (syncStore.has(userId)) {
    entry.syncStore = { ...syncStore };
    syncQueue.add(userId);
    return;
  }

  // Lock the userId
  syncStore.add(userId);

  try {
    const items = await getItemsForUser(userId);
    const itemEntry: ItemEntry = { items: [], origin };

    await Promise.all(
      items.map(async (item) => {
        console.log("sync transaction", item.item.institutionName);
        return await syncTransaction({ ...item, userId }, itemEntry);
      })
    );
    console.log("all transactions synced");
  } catch (error) {
    console.error(`Error syncing transactions for user ${userId}:`, error);
    // Optionally, you might want to requeue the userId here or handle the error.
  } finally {
    // Unlock the userId
    syncStore.delete(userId);

    // Process queue without recursion
    if (syncQueue.has(userId)) {
      syncQueue.delete(userId);
      await syncTransactionsForUser(userId);
    }
  }
}

async function updateAccounts(
  accounts: SyncResponse["accounts"],
  itemId: string
) {
  await Promise.all(
    accounts.map(async (account) => {
      const accountTypeId = await getAccountTypeIdByName(account.type);
      if (!accountTypeId) return;
      const acc = await getAccount(account.account_id);

      const balance = (account.balances.available || account.balances.current)!;

      if (!acc) {
        await addAccount({
          id: account.account_id,
          name: account.name,
          accountTypeId: accountTypeId.id,
          currencyCodeId: null,
        });
        await addPlaidAccount({
          id: v4(),
          accountTypeId: accountTypeId.id,
          balance: (account.type === "credit"
            ? Math.abs(
              balance - (account.balances.limit ? account.balances.limit : 0)
            )
            : balance
          ).toString(),
          itemId: itemId,
          currencyCodeId: null,
          accountsId: account.account_id,
        });
      } else {
        // update acc balance
        updatePlaidAccount(account.account_id, {
          balance: (account.type === "credit"
            ? Math.abs(
              balance - (account.balances.limit ? account.balances.limit : 0)
            )
            : balance
          ).toString(),
        });
      }
    })
  );
}

type SyncResponse = {
  accounts: {
    account_id: string;
    balances: {
      available: number | null;
      current: number | null;
      iso_currency_code: string | null;
      limit: number | null;
    };
    name: string;
    type: string;
  }[];
  added: AddedPlaidTransaction[];
  removed: { transaction_id: string }[];
  modified: ModifiedPlaidTransaction[];
  next_cursor: string;
  has_more: boolean;
  error_code: string | undefined;
};

async function syncTransaction(
  { item }: { item: Item; userId: string },
  entry?: ItemEntry
) {
  try {
    // console.log(entry, "entry exists?");
    const count = 500;
    let cursor: string | undefined = item.nextCursor
      ? item.nextCursor
      : undefined;
    const originalCursor = cursor;

    let toAdd: AddedPlaidTransaction[] = [];
    let toModify: ModifiedPlaidTransaction[] = [];
    let toRemove: { transaction_id: string }[] = [];
    while (true) {
      const response = (await plaidRequest("/transactions/sync", {
        access_token: item.plaidAccessToken,
        cursor,
        count,
      })) as SyncResponse;

      if (
        response.error_code === "TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION"
      ) {
        cursor = originalCursor;
        toAdd = [];
        toModify = [];
        toRemove = [];
        continue;
      }

      const { accounts } = response;
      if (accounts) await updateAccounts(accounts, item.id);

      if (entry && !entry.items.find((item) => item.id)) {
        console.log("pushing item into entry!");
        entry.items.push({
          id: item.id,
          timestamp: new Date(Date.now()).toLocaleString(),
          responses: [{ reqCursor: cursor, response }],
        });
      } else if (entry) {
        console.log("creating new item in entry!");
        entry.items
          .find((item) => item.id)!
          .responses.push({ reqCursor: cursor, response });
      }

      const { added, modified, removed, next_cursor, has_more } = response;
      !added && console.log(response, "sync response where added is undefined");
      added && added.forEach((added) => toAdd.push(added));
      modified && modified.forEach((modified) => toModify.push(modified));
      removed && removed.forEach((removed) => toRemove.push(removed));
      cursor = next_cursor;
      if (!has_more && next_cursor) {
        break;
      }
    }

    toAdd.length > 0 && (await addTransactions(toAdd));
    toModify.length > 0 && (await Promise.all(toModify.map(modifyTransaction)));
    toRemove.length > 0 &&
      (await deleteTransactions(
        toRemove.map((removed) => removed.transaction_id)
      ));

    await updateItem(item.id, {
      nextCursor: cursor,
    });

    handleTransactionWebsocketEvents(toAdd, toModify, toRemove, item.userId);
  } catch (e) {
    console.error(e);
    console.trace();
  }
}

type TransactionEvent = { transactionIds: string[]; accountId: string };

function parseTransactionsIntoWebsocketMessage(
  acc: TransactionEvent[],
  currentTransaction: { transaction_id: string; account_id: string },
  _: number
) {
  const index = acc.findIndex(
    (item) => item.accountId === currentTransaction.account_id
  );
  if (index === -1) {
    acc.push({
      accountId: currentTransaction.account_id,
      transactionIds: [currentTransaction.account_id],
    });
  } else {
    acc[index].transactionIds.push(currentTransaction.transaction_id);
  }
  return acc;
}

function handleTransactionWebsocketEvents(
  added: AddedPlaidTransaction[],
  modified: ModifiedPlaidTransaction[],
  removed: { transaction_id: string }[],
  userId: string
) {
  const addedMessage = added.reduce(
    parseTransactionsIntoWebsocketMessage,
    [] as TransactionEvent[]
  );
  const modifiedMessage = (modified as PlaidTransactionGeneral[]).reduce(
    parseTransactionsIntoWebsocketMessage,
    [] as TransactionEvent[]
  );
  const removedMessage = (removed as PlaidTransactionGeneral[]).reduce(
    parseTransactionsIntoWebsocketMessage,
    [] as TransactionEvent[]
  );

  console.log("potentially sending websocket sync/update events");
  if (addedMessage.length > 0) {
    io.to(userId).emit("newTransaction", JSON.stringify(addedMessage));
  }
  if (modifiedMessage.length > 0) {
    io.to(userId).emit("newTransaction", JSON.stringify(modifiedMessage));
  }
  if (removedMessage.length > 0) {
    io.to(userId).emit("newTransaction", JSON.stringify(removedMessage));
  }
}

interface PlaidTransactionGeneral {
  transaction_id: string;
  personal_finance_category: { primary: string };
  account_id: string;
  amount: number;
  date: string;
  datetime: string | null;
  merchant_name: string | null;
  name: string;
  logo_url: string;
  pending: boolean;
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface AddedPlaidTransaction extends PlaidTransactionGeneral {
  location: Location;
}

interface ModifiedPlaidTransaction extends Nullable<PlaidTransactionGeneral> {
  location: Nullable<Location>;
}

interface Location {
  address: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

async function addTransactions(transactions: AddedPlaidTransaction[]) {
  const newTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      const categoryId = await getCategoryIdByName(
        transaction.personal_finance_category.primary
      );
      if (!categoryId) {
        throw new Error("No such category!");
      }
      const locationIsNull = Object.values(transaction.location).some(
        (value) => value === null
      );
      return {
        id: transaction.transaction_id,
        address: locationIsNull
          ? null
          : `${transaction.location.address!},  ${transaction.location
            .city!}, ${transaction.location.region!}, ${transaction.location
              .country!}`,
        accountId: transaction.account_id,
        categoryId: categoryId.id,
        company: transaction.merchant_name
          ? transaction.merchant_name
          : transaction.name,
        amount: transaction.amount,
        timestamp: transaction.datetime
          ? transaction.datetime
          : transaction.date,
        latitude: transaction.location.lat,
        longitude: transaction.location.lon,
        pending: transaction.pending,
      };
    })
  );
  newTransactions.length > 0 && createTransactions(newTransactions);
}

async function modifyTransaction(transaction: ModifiedPlaidTransaction) {
  let categoryId: { id: string } | undefined | null = undefined;
  if (transaction.personal_finance_category) {
    categoryId = await getCategoryIdByName(
      transaction.personal_finance_category.primary
    );
    if (!categoryId) throw new Error("No such category!");
  }

  const transactionId = transaction.transaction_id
    ? transaction.transaction_id
    : "";
  updateTransaction(transactionId, {
    // address: transaction.location ? locationToAddress(transaction.location) : undefined,

    accountId: transaction.account_id!,
    categoryId: categoryId ? categoryId.id : undefined,
    company: transaction.merchant_name
      ? transaction.merchant_name
      : transaction.name
        ? transaction.name
        : undefined,
    amount: transaction.amount ? transaction.amount : undefined,
    timestamp: transaction.datetime
      ? transaction.datetime
      : transaction.date
        ? transaction.date
        : undefined,
    latitude: transaction.location.lat ? transaction.location.lat : undefined,
    longitude: transaction.location.lon ? transaction.location.lon : undefined,
  });
}
