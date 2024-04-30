import { getDB } from "../database/client";
import { transactions } from "../database/schema/transaction";
import { eq } from "drizzle-orm";
import { getUser } from "./user.service";
import { type Transaction } from "../interface/interface";

let db = getDB();

export const getTransactionsForUser = async (
  userId: number
): Promise<Transaction[] | null> => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return null;
    }
    const allTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
    return allTransactions;
  } catch (error) {
    console.error(error);
    return [];
  }
};
