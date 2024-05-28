import { type GroupWithEqualSplitTypeTransactionsAndMembers } from '../services/group.service';

export const filterUniqueTransactions = (
  transactions: GroupWithEqualSplitTypeTransactionsAndMembers
) => {
  const seen = new Set();
  const uniqueTransactions: GroupWithEqualSplitTypeTransactionsAndMembers = [];

  transactions.forEach((transaction) => {
    const transactionId = transaction.transaction.id;
    if (!seen.has(transactionId)) {
      seen.add(transactionId);
      uniqueTransactions.push(transaction);
    }
  });

  return uniqueTransactions;
};
