import { type ExtractFunctionReturnType } from '../../../../services/user.service';
import { getAccountWithTransactions } from '../../../../services/plaid.service';
import Transaction from './Transaction';

type AccountWithTransactions = ExtractFunctionReturnType<
  typeof getAccountWithTransactions
>;

export const TransactionList = (props: {
  account: AccountWithTransactions;
  groupId?: string;
  route?: string;
  groupTransactionIds?: string[];
}) => {
  function isChecked(transactionId: string, groupTransactionIds: string[]) {
    return groupTransactionIds.includes(transactionId);
  }

  function sortTransactionsByTimestamp(
    transactions: AccountWithTransactions['transactions']
  ) {
    return transactions.slice().sort((a, b) => {
      const dateA = new Date(a.timestamp || '');
      const dateB = new Date(b.timestamp || '');
      return dateB.getTime() - dateA.getTime();
    });
  }

  return (
    <div class="animate-fade-in">
      {sortTransactionsByTimestamp(props.account.transactions).map(
        (transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
            {...(props.route ? { route: props.route } : {})}
            {...(props.groupId ? { groupId: props.groupId } : {})}
            {...(props.groupTransactionIds
              ? {
                  checked: isChecked(transaction.id, props.groupTransactionIds),
                }
              : {})}
          />
        )
      )}
    </div>
  );
};
