import { getDB } from '../database/client';
import { users } from '../database/schema/users';
import { categories } from '../database/schema/category';
import { transactions } from '../database/schema/transaction';
import { eq, desc } from 'drizzle-orm';
import { findUser } from './user.service';
import { v4 as uuidv4 } from 'uuid';

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

  if (!joined[0]) throw new Error('no such transaction');
  return joined[0];
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
