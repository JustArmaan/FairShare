import { getDB } from "../database/client";
import { users } from "../database/schema/users";
import { categories } from "../database/schema/category";
import { transactions } from "../database/schema/transaction";
import { eq, desc, like, and, or, gte, lt } from "drizzle-orm";
import { findUser } from "./user.service";
import { v4 as uuidv4 } from "uuid";
import { get } from "http";

const db = getDB();

export async function debug_getTransactionsForAnyUser(limit: number = 9999) {
  const firstUser = (await db.select().from(users).limit(1))[0];
  if (!firstUser) {
    return;
  }
  return await getTransactionsForUser(firstUser.id, limit);
}

export async function getTransactionsForUser(
  userId: string,
  limit: number = 9999
) {
  try {
    const user = await findUser(userId);
    if (!user) {
      return [];
    }

    const result = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
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

  if (!joined[0]) throw new Error("no such transaction");
  return joined[0];
}

export async function createTransaction(
  userId: string,
  categoryId: string,
  company: string,
  amount: number,
  timestamp: string,
  address: string,
  latitude: number,
  longitude: number
) {
  try {
    const newTransaction = await db.insert(transactions).values({
      id: uuidv4(),
      userId: userId,
      categoryId: categoryId,
      company: company,
      amount: amount,
      timestamp: timestamp,
      address: address,
      latitude: latitude,
      longitude: longitude,
    });
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

export async function searchTransactions(
  userId: string,
  query: string,
  limit: number = 9999
) {
  try {
    const result = await db
      .select()
      .from(transactions)
      .innerJoin(categories, eq(categories.id, transactions.categoryId))
      .where(
        and(
          eq(transactions.userId, userId),
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
    nextMonth: nextMonth.toString().padStart(2, "0"),
  };
}
export async function getTransactionsByMonth(
  userId: string,
  year: string,
  month: string
) {
  try {
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
          eq(transactions.userId, userId),
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
    console.error("Error retrieving transactions:", error);
    return [];
  }
}

// const monthlyTransactions = await getTransactionsByMonth(
//   "kp_1f69766a544b4f1e8ab2e4c795757fd9",
//   "2024",
//   "04
// console.log(monthlyTransactions, "monthly transactions for April 2024");
