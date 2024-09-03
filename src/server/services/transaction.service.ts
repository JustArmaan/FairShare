import { categories } from "../database/schema/category";
import { transactions } from "../database/schema/transaction";
import { eq, desc, like, and, or, gte, lt, inArray, count } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { ExtractFunctionReturnType } from "./user.service";
import type { TransactionSchema } from "../interface/types";
import { accounts } from "../database/schema/accounts";
import { items } from "../database/schema/items";
import { plaidAccount } from "../database/schema/plaidAccount";
import { cashAccount } from "../database/schema/cashAccount";
import { users } from "../database/schema/users";
import { getItem } from "./plaid.service";

const db = getDB();

export async function getTransactionsForUser(
  accountId: string,
  limit: number = 9999
) {
  const result = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.timestamp))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.accountId, accountId))
    .limit(limit);

  const joined = result.map((result) => {
    return {
      ...result.transactions,
      category: { ...result.categories },
    };
  });

  return joined;
}

export function getCurrentMonthYear(): { year: string; month: string } {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return { year, month };
}

export async function getTransaction(transactionId: string) {
  const transaction = await db
    .select()
    .from(transactions)
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .where(eq(transactions.id, transactionId));

  const joined = transaction.map((transaction) => {
    return {
      ...transaction.transactions,
      category: { ...transaction.categories },
    };
  });

  if (!joined[0]) throw new Error("no such transaction");
  return joined[0];
}

async function getTransactionNoJoins(transactionId: string) {
  const transaction = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, transactionId));

  return transaction[0];
}

export type Transaction = ExtractFunctionReturnType<
  typeof getTransactionNoJoins
>;

export async function createTransactions(newTransactions: Transaction[]) {
  await db.insert(transactions).values(newTransactions);
}
export async function getCashAccount(accountId: string) {
  const result = await db
    .select()
    .from(cashAccount)
    .where(eq(cashAccount.id, accountId));
  return result[0];
}

export async function getCashAccountForUser(userId: string) {
  const result = await db
    .select({ cashAccount: cashAccount })
    .from(cashAccount)
    .innerJoin(users, eq(users.id, cashAccount.userId))
    .where(eq(cashAccount.userId, userId));
  console.log(result), "result in getCashAccountForUser";
  if (result.length === 0) return null;
  return result[0].cashAccount;
}

export type CashAccount = ExtractFunctionReturnType<typeof getCashAccount>;

export async function getCashAccountWithTransactions(userId: string) {
  const result = await db
    .select()
    .from(cashAccount)
    .innerJoin(users, eq(users.id, cashAccount.userId))
    .innerJoin(transactions, eq(transactions.accountId, cashAccount.id))
    .where(eq(cashAccount.userId, userId));
  return result;
}

export async function createCashAccount(account: Omit<cashAccount, "id">) {
  await db.insert(cashAccount).values({
    id: uuid(),
    userId: account.userId,
    account_id: account.account_id,
  });
}

export type cashAccount = ExtractFunctionReturnType<typeof getCashAccount>;

export async function createTransaction(transaction: Omit<Transaction, "id">) {
  const id = uuid();
  await db.insert(transactions).values({
    id: uuid(),
    ...transaction,
  });
  return id;
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Omit<Transaction, "id">>
) {
  const newTransaction = await db
    .update(transactions)
    .set({
      ...transaction,
    })
    .where(eq(transactions.id, id));
  return newTransaction;
}

export async function getTransactionLocation(transactionId: string) {
  const transaction = await getTransaction(transactionId);
  return {
    latitude: transaction.latitude,
    longitude: transaction.longitude,
  };
}

export async function deleteTransactions(transactionIds: string[]) {
  const newTransaction = await db
    .delete(transactions)
    .where(inArray(transactions.id, transactionIds));
}

export async function searchTransactions(
  accountId: string,
  query: string,
  limit: number = 9999
) {
  const result = await db
    .select()
    .from(transactions)
    .innerJoin(accounts, eq(accounts.id, transactions.accountId))
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .where(
      and(
        eq(transactions.accountId, accountId),
        or(
          like(transactions.company, `%${query}%`),
          like(categories.name, `%${query}%`),
          like(transactions.address, `%${query}%`)
        )
      )
    )
    .limit(limit)
    .all();

  const joined = result.map((result) => {
    return {
      ...result.transactions,
      category: { ...result.categories },
    };
  });

  return joined;
}

export function getNextMonthYear(currentYear: string, currentMonth: string) {
  let nextMonth = parseInt(currentMonth, 10) + 1;
  let nextYear = parseInt(currentYear, 10);
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return {
    nextYear: nextYear.toString(),
    nextMonth: nextMonth.toString().padStart(2, "0"),
  };
}

export async function getTransactionsByMonth(
  accountId: string,
  year: string,
  month: string
) {
  const paddedMonth = month.padStart(2, "0");
  const startDate = `${year}-${paddedMonth}-01`;
  const { nextYear, nextMonth } = getNextMonthYear(year, paddedMonth);
  const endDate = `${nextYear}-${nextMonth}-01`;

  const result = await db
    .select()
    .from(transactions)
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .where(
      and(
        eq(transactions.accountId, accountId),
        gte(transactions.timestamp, startDate),
        lt(transactions.timestamp, endDate)
      )
    )
    .all();

  const joined = result.map((result) => {
    return {
      ...result.transactions,
      category: { ...result.categories },
    };
  });

  return joined;
}

export async function getAccountForUserWithMostTransactions(userId: string) {
  const allUserTransactions = await db
    .select()
    .from(transactions)
    .innerJoin(accounts, eq(accounts.id, transactions.accountId))
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(items.id, plaidAccount.itemId))
    .where(eq(items.userId, userId));

  const grouped = allUserTransactions.reduce(
    (acc, transaction) => {
      const accountId = transaction.transactions.accountId;
      if (!acc[accountId]) {
        acc[accountId] = 0;
      }
      acc[accountId]++;
      return acc;
    },
    {} as Record<string, number>
  );
  const accountIds = Object.keys(grouped);
  const maxTransactions = Math.max(...Object.values(grouped));
  const accountId = accountIds.find(
    (accountId) => grouped[accountId] === maxTransactions
  );

  return accountId;
}

type ItemSchema = ExtractFunctionReturnType<typeof getItem>;
// i cba typing this out
function reduceItemResultsIntoDictionary(
  aggregate: { item: ItemSchema; transactions: TransactionSchema[] }[],
  currentValue: any
) {
  const itemIndex = aggregate.findIndex(
    (entry: any) => entry.item.id === currentValue.items.id
  );

  const newTransaction = {
    ...currentValue.transactions,
    category: currentValue.categories,
  };

  if (itemIndex === -1) {
    aggregate.push({
      item: { ...currentValue.items },
      transactions: [newTransaction],
    });
  } else {
    aggregate[itemIndex].transactions.push(newTransaction);
  }
  return aggregate;
}

export async function getItemsWithAllTransactions(userId: string) {
  const results = await db
    .select({ items, transactions, categories })
    .from(items)
    .innerJoin(plaidAccount, eq(plaidAccount.itemId, items.id))
    .innerJoin(accounts, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(transactions, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(items.userId, userId));

  return results.reduce(
    reduceItemResultsIntoDictionary,
    [] as { item: ItemSchema; transactions: TransactionSchema[] }[]
  );
}

export async function getItemWithAllTransactions(itemId: string) {
  const results = await db
    .select({ items, transactions, categories })
    .from(items)
    .innerJoin(plaidAccount, eq(plaidAccount.itemId, items.id))
    .innerJoin(accounts, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(transactions, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(items.id, itemId));

  type ItemSchema = ExtractFunctionReturnType<typeof getItem>;
  return results.reduce(
    reduceItemResultsIntoDictionary,
    [] as { item: ItemSchema; transactions: TransactionSchema[] }[]
  )[0];
}
