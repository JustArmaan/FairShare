import { getDB } from "../database/client.ts";
import { v4 as uuidv4 } from "uuid";
import { and, eq, gte, lt } from "drizzle-orm";
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
  try {
    const results = await db
      .select({ item: items })
      .from(users)
      .innerJoin(items, eq(users.id, items.userId))
      .where(eq(users.id, userId));

    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
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
  try {
    const result = await db
      .select({ items: items })
      .from(items)
      .innerJoin(plaidAccount, eq(items.id, plaidAccount.itemId))
      .where(eq(items.id, id));
    return result[0].items;
  } catch (error) {
    console.error(error, "at getItem");
  }
}

export async function deleteItem(itemId: string) {
  try {
    await db.delete(items).where(eq(items.id, itemId));
  } catch (e) {
    console.error(e, "at deleteItem");
  }
}

export async function createCurrencyCode(code: string) {
  try {
    await db.insert(currencyCode).values({ id: uuidv4(), code });
  } catch (error) {
    console.error(error);
  }
}

export async function updateItem(
  itemId: string,
  item: Partial<Omit<Item, "id">>
) {
  await db.update(items).set(item).where(eq(items.id, itemId));
}

export async function getCurrencyCode(id: string) {
  try {
    const result = await db
      .select()
      .from(currencyCode)
      .where(eq(currencyCode.id, id));
    return result[0];
  } catch (error) {
    console.error(error);
  }
}

export type AccountSchema = ArrayElement<
  ExtractFunctionReturnType<typeof getAccountsForUser>
>;

export async function getAccountsForUser(userId: string, itemId: string) {
  try {
    const results = await db
      .select({ accounts })
      .from(accounts)
      .innerJoin(plaidAccount, eq(accounts.id, plaidAccount.accountsId))
      .innerJoin(items, eq(plaidAccount.itemId, items.id))
      .where(and(eq(items.id, itemId), eq(items.userId, userId)));
    return results.map((result) => result.accounts);
  } catch (e) {
    console.error(e, "at getAccountsForUser");
    return null;
  }
}

export async function getCashAccountForUser(userId: string) {
  try {
    const results = await db
      .select({ account: accounts, transactions: transactions })
      .from(accounts)
      .innerJoin(cashAccount, eq(accounts.id, cashAccount.account_id))
      .innerJoin(users, eq(cashAccount.userId, users.id))
      .innerJoin(transactions, eq(accounts.id, transactions.accountId))
      .where(eq(cashAccount.userId, userId));
    return results.map((result) => result)[0];
  } catch (e) {
    console.error(e, "in getCashAccountForUser");
  }
}

export type AccountWithTransactions = ExtractFunctionReturnType<
  typeof getAccountWithTransactions
>;

export async function getAccountWithTransactions(accountId: string) {
  try {
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
  } catch (e) {
    console.error(e, "at getAccountWithTransactions");
    return null;
  }
}

export async function getAccountWithCurrentMonthTransactions(
  accountId: string
) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const { nextYear, nextMonth } = getNextMonthYear(currentYear, currentMonth);
  const startDate = `${currentYear}-${currentMonth}-01`;
  const endDate = `${nextYear}-${nextMonth}-01`;

  try {
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
  } catch (error) {
    console.error(error, "at getAccountWithCurrentMonthTransactions");
    return null;
  }
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

  try {
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
  } catch (error) {
    console.error(error, "at getAccountWithMonthTransactions");
    return null;
  }
}

export async function getCashAccountWithTransaction(accountId: string) {
  try {
    const result = await db
      .select({
        account: accounts,
        transaction: transactions,
        categories: categories,
      })
      .from(accounts)
      .innerJoin(transactions, eq(accounts.id, transactions.accountId))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .innerJoin(cashAccount, eq(accounts.id, cashAccount.account_id))
      .where(eq(accounts.id, accountId));
    return {
      ...result[0].account,
      transactions: result.map((result) => ({
        ...result.transaction,
        category: { ...result.categories },
      })),
    };
  } catch (e) {
    return null;
  }
}

export async function getPlaidAccountsForUser(itemId: string) {
  try {
    const results = await db
      .select({ plaidAccount: plaidAccount })
      .from(plaidAccount)
      .where(eq(plaidAccount.itemId, itemId));
    return results;
  } catch (e) {
    console.error(e, "at getPlaidAccountsForUser");
    return null;
  }
}

export type PlaidAccount = ArrayElement<
  ExtractFunctionReturnType<typeof getPlaidAccountsForUser>
>;
