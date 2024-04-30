import { getDB } from "../database/client";
import { categories } from "../database/schema/category";
import { transactions } from "../database/schema/transaction";
import { eq } from "drizzle-orm";
import { getUser } from "./user.service";

let db = getDB();

export const getTransactionsForUser = async (
  userId: number
): Promise<any[] | []> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return [];
    }
    const allTransactions = await db
      .select()
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId));
    return allTransactions;
  } catch (error) {
    console.error(error);
    return [];
  }
};