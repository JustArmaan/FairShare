import { getDB } from '../database/client';
import { users } from '../database/schema/users';
import { categories } from '../database/schema/category';
import { transactions } from '../database/schema/transaction';
import { eq, desc } from 'drizzle-orm';
import { getUser } from './user.service';

const db = getDB();

export async function debug_getTransactionsForAnyUser(limit: number = 9999) {
  const firstUser = (await db.select().from(users).limit(1))[0];
  return await getTransactionsForUser(firstUser.id, limit);
}

export async function getTransactionsForUser(
  userId: number,
  limit: number = 9999
) {
  try {
    const user = await getUser(userId);
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
