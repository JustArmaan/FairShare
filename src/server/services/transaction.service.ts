import { getDB } from '../database/client';
import { categories } from '../database/schema/category';
import { transactions } from '../database/schema/transaction';
import { eq, desc } from 'drizzle-orm';
import { getUser } from './user.service';

let db = getDB();

export const getTransactionsForUser = async (
  userId: number,
  limit: number = 0
) => {
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
      .limit(limit ? limit : 99999); // hacky
  } catch (error) {
    console.error(error);
    return [];
  }
};
