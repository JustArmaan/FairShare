import { getDB } from '../database/client';
import { users } from '../database/schema/users';
import { categories } from '../database/schema/category';
import { transactions } from '../database/schema/transaction';
import { eq, desc, like, and, or, gte, lt, inArray, count } from 'drizzle-orm';
import { findUser } from './user.service';
import { v4 as uuid } from 'uuid';
import type { ExtractFunctionReturnType } from './user.service';
import { accounts } from '../database/schema/accounts';
import { items } from '../database/schema/items';

const db = getDB();

export async function getTransactionsForUser(
  accountId: string,

  limit: number = 9999
) {
  try {
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
  } catch (error) {
    console.error(error);
    return [];
  }
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

  if (!joined[0]) throw new Error('no such transaction');
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
  try {
    await db
      .insert(transactions)
      .values(newTransactions.map((transaction) => ({ ...transaction })));
  } catch (error) {
    console.error(error);
  }
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    const newTransaction = await db.insert(transactions).values({
      id: uuid(),
      ...transaction,
    });
    return newTransaction;
  } catch (error) {
    console.error(error);
  }
}

export async function updateTransaction(
  id: string,
  transaction: Partial<Omit<Transaction, 'id'>>
) {
  try {
    const newTransaction = await db
      .update(transactions)
      .set({
        ...transaction,
      })
      .where(eq(transactions.id, id));
    return newTransaction;
  } catch (error) {
    console.error(error);
  }
}

export async function getTransactionLocation(transactionId: string) {
  try {
    const transaction = await getTransaction(transactionId);
    return {
      latitude: transaction.latitude,
      longitude: transaction.longitude,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteTransactions(transactionIds: string[]) {
  try {
    const newTransaction = await db
      .delete(transactions)
      .where(inArray(transactions.id, transactionIds));
  } catch (error) {
    console.error(error);
  }
}

export async function searchTransactions(
  accountId: string,
  query: string,
  limit: number = 9999
) {
  try {
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
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getNextMonthYear(year: string, month: string) {
  let nextMonth = parseInt(month, 10) + 1;
  let nextYear = parseInt(year, 10);
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return {
    nextYear: nextYear.toString(),
    nextMonth: nextMonth.toString().padStart(2, '0'),
  };
}
export async function getTransactionsByMonth(
  accountId: string,
  year: string,
  month: string
) {
  try {
    const paddedMonth = month.padStart(2, '0');
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
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }
}

export async function getAccountForUserWithMostTransactions(userId: string) {
  try {
    const allUserTransactions = await db
      .select()
      .from(transactions)
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .innerJoin(items, eq(items.id, accounts.itemId))
      .where(eq(items.userId, userId));

    const grouped = allUserTransactions.reduce((acc, transaction) => {
      const accountId = transaction.transactions.accountId;
      if (!acc[accountId]) {
        acc[accountId] = 0;
      }
      acc[accountId]++;
      return acc;
    }, {} as Record<string, number>);
    const accountIds = Object.keys(grouped);
    const maxTransactions = Math.max(...Object.values(grouped));
    const accountId = accountIds.find(
      (accountId) => grouped[accountId] === maxTransactions
    );

    return accountId;
  } catch (error) {
    console.error(error);
    return null;
  }
}
