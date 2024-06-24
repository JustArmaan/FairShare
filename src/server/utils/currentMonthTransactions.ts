import { getCurrentMonthYear } from "../services/transaction.service";
import { getTransactionsByMonth } from "../services/transaction.service";

export async function getCurrentMonthTransactions(accountId: string) {
  const { year, month } = getCurrentMonthYear();
  const transactions = await getTransactionsByMonth(accountId, year, month);
  return transactions;
}
