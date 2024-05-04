import { getDB } from "../database/client";
import { users } from "../database/schema/users";
import { categories } from "../database/schema/category";
import { transactions } from "../database/schema/transaction";
import { eq, desc } from "drizzle-orm";
import { findUser } from "./user.service";
import { v4 as uuidv4 } from "uuid";

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

    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .limit(limit);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const transaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));

    return transaction[0];
  } catch (error) {
    console.error(error);
  }
}

export async function createTransaction(
  userId: string,
  categoryId: string,
  company: string,
  amount: number,
  timestamp: string,
  address: string
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
    });
    return newTransaction;
  } catch (error) {
    console.error(error);
  }
}
