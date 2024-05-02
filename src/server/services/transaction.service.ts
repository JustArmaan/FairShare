import { getDB } from "../database/client";
import { categories } from "../database/schema/category";
import { transactions } from "../database/schema/transaction";
import { eq, asc, desc } from "drizzle-orm";
import { getUser } from "./user.service";

let db = getDB();

export const getTransactionsForUser = async (
  userId: number,
  limit: number = 0
): Promise<any[] | []> => {
  // 😭 How the heck do I fix this??? 😭
  try {
    const user = await getUser(userId);
    if (!user) {
      return [];
    }
    let query = db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId));

    if (limit > 0) {
      query = query.limit(limit); // 🤔 This is weird because it work 
      // https://orm.drizzle.team/learn/guides/limit-offset-pagination
    }

    const allTransactions = await query;
    return allTransactions;
  } catch (error) {
    console.error(error);
    return [];
  }
};
