import { getDB } from "../database/client.ts";
import { v4 as uuidv4 } from "uuid";
import { and, eq, gte, inArray, lt } from "drizzle-orm";
import { items } from "../database/schema/items.ts";
import { users } from "../database/schema/users.ts";
import { currencyCode } from "../database/schema/currencyCode.ts";
import { type ArrayElement } from "../interface/types.ts";
import { type ExtractFunctionReturnType } from "./user.service.ts";
import { transactions } from "../database/schema/transaction.ts";
import { accounts } from "../database/schema/accounts.ts";
import { categories } from "../database/schema/category.ts";
import { getAccountTypeById } from "./accountType.service.ts";
import { getAccount } from "./account.service.ts";
import { plaidAccount } from "../database/schema/plaidAccount.ts";
import { cashAccount } from "../database/schema/cashAccount.ts";
import { getNextMonthYear } from "./transaction.service.ts";

const db = getDB();

export const getItemsForUser = async (userId: string) => {
  const results = await db
    .select({ item: items })
    .from(users)
    .innerJoin(items, eq(users.id, items.userId))
    .where(eq(users.id, userId));

  return results;
};

export type Item = ArrayElement<
  ExtractFunctionReturnType<typeof getItemsForUser>
>["item"];

export const addItemToUser = async (
  userId: string,
  item: Omit<Omit<Item, "userId">, "institutionId">
) => {
  await db.insert(items).values({
    userId: userId,
    ...item,
  });
};

export async function getItem(id: string) {
  const result = await db
    .select({ items: items })
    .from(items)
    .innerJoin(plaidAccount, eq(items.id, plaidAccount.itemId))
    .where(eq(items.id, id));
  if (result.length === 0) return null;
  return result[0].items;
}

export async function deleteItem(itemId: string) {
  const relatedAccounts = (
    await db
      .select({ accounts })
      .from(plaidAccount)
      .where(eq(plaidAccount.itemId, itemId))
      .innerJoin(accounts, eq(accounts.id, plaidAccount.accountsId))
  ).map((result) => result.accounts);
  await db.delete(accounts).where(
    inArray(
      accounts.id,
      relatedAccounts.map((account) => account.id)
    )
  );
  await db.delete(items).where(eq(items.id, itemId));
}

export async function createCurrencyCode(code: string) {
  await db.insert(currencyCode).values({ id: uuidv4(), code });
}

export async function updateItem(
  itemId: string,
  item: Partial<Omit<Item, "id">>
) {
  await db.update(items).set(item).where(eq(items.id, itemId));
}

export async function getCurrencyCode(id: string) {
  const result = await db
    .select()
    .from(currencyCode)
    .where(eq(currencyCode.id, id));
  return result[0];
}

export type AccountSchema = ArrayElement<
  ExtractFunctionReturnType<typeof getAccountsForUser>
>;

export async function getAccountsForUser(userId: string, itemId: string) {
  const results = await db
    .select({ accounts })
    .from(accounts)
    .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
    .innerJoin(items, eq(plaidAccount.itemId, items.id))
    .where(and(eq(items.id, itemId), eq(items.userId, userId)));
  return results.map((result) => result.accounts);
}

export async function getCashAccountForUser(userId: string) {
  const results = await db
    .select({ account: accounts, transactions: transactions })
    .from(accounts)
    .innerJoin(cashAccount, eq(accounts.id, cashAccount.account_id))
    .innerJoin(users, eq(cashAccount.userId, users.id))
    .innerJoin(transactions, eq(accounts.id, transactions.accountId))
    .where(eq(cashAccount.userId, userId));
  return results.map((result) => result)[0];
}

export type AccountWithTransactions = ExtractFunctionReturnType<
  typeof getAccountWithTransactions
>;

export async function getAccountWithTransactions(accountId: string) {
  const result = await db
    .select({
      account: accounts,
      transaction: transactions,
      categories: categories,
      // bankName: items.,
    })
    .from(accounts)
    .innerJoin(transactions, eq(accounts.id, transactions.accountId))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    // .innerJoin(items, eq(accounts.itemId, items.id))
    .where(eq(accounts.id, accountId));

  const account = await getAccount(accountId);
  if (!account) return null;

  const accountType = account.accountTypeId
    ? await getAccountTypeById(account.accountTypeId)
    : account.accountTypeId;

  return {
    ...account,
    accountTypeId: accountType,
    transactions: result.map((result) => ({
      ...result.transaction,
      category: { ...result.categories },
    })),
  };
}

export async function getAccountWithCurrentMonthTransactions(
  accountId: string,
  lastMonth?: boolean
) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + (lastMonth ? 0 : 1))
    .toString()
    .padStart(2, "0");

  const { nextYear, nextMonth } = getNextMonthYear(currentYear, currentMonth);
  const startDate = `${currentYear}-${currentMonth}-01`;
  const endDate = `${nextYear}-${nextMonth}-01`;

  const result = await db
    .select({
      account: accounts,
      transaction: transactions,
      categories: categories,
    })
    .from(accounts)
    .innerJoin(transactions, eq(accounts.id, transactions.accountId))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(accounts.id, accountId),
        gte(transactions.timestamp, startDate),
        lt(transactions.timestamp, endDate)
      )
    );

  const account = await getAccount(accountId);
  if (!account) return null;

  const accountType = account.accountTypeId
    ? await getAccountTypeById(account.accountTypeId)
    : null;

  return {
    ...account,
    accountTypeId: accountType,
    transactions: result.map((entry) => ({
      ...entry.transaction,
      category: { ...entry.categories },
    })),
  };
}

export async function getAccountWithMonthTransactions(
  accountId: string,
  year: number,
  month: number
) {
  const currentYear = year.toString();
  const currentMonth = month.toString().padStart(2, "0");

  const { nextYear, nextMonth } = getNextMonthYear(currentYear, currentMonth);
  const startDate = `${currentYear}-${currentMonth}-01`;
  const endDate = `${nextYear}-${nextMonth}-01`;

  const result = await db
    .select({
      account: accounts,
      transaction: transactions,
      categories: categories,
    })
    .from(accounts)
    .innerJoin(transactions, eq(accounts.id, transactions.accountId))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(accounts.id, accountId),
        gte(transactions.timestamp, startDate),
        lt(transactions.timestamp, endDate)
      )
    );

  const account = await getAccount(accountId);
  if (!account) return null;

  const accountType = account.accountTypeId
    ? await getAccountTypeById(account.accountTypeId)
    : null;

  const transactionList = result.map((entry) => ({
    ...entry.transaction,
    category: { ...entry.categories },
  }));

  return {
    ...account,
    accountTypeId: accountType,
    transactions: transactionList,
  };
}

export async function getCashAccountWithTransaction(accountId: string) {
  const result = await db
    .select({
      account: accounts,
      transaction: transactions,
      categories: categories,
    })
    .from(accounts)
    .leftJoin(transactions, eq(accounts.id, transactions.accountId))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .innerJoin(cashAccount, eq(accounts.id, cashAccount.account_id))
    .where(eq(accounts.id, accountId));

  if (!result || result.length === 0) {
    console.error("No account found for the given accountId");
    return null;
  }

  const accountData = result[0].account;

  const transactionsResult = result.map((row) => ({
    ...row.transaction,
    category: row.categories ? { ...row.categories } : null,
  }));

  return {
    ...accountData,
    transactions: transactionsResult.filter((tx) => tx.id),
  };
}

export async function getPlaidAccountsForUser(itemId: string) {
  const results = await db
    .select({ plaidAccount: plaidAccount })
    .from(plaidAccount)
    .where(eq(plaidAccount.itemId, itemId));
  return results;
}

export type PlaidAccount = ArrayElement<
  ExtractFunctionReturnType<typeof getPlaidAccountsForUser>
>;
