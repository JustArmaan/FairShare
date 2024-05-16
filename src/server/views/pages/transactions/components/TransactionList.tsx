import { type TransactionSchema } from '../../../../interface/types';
import { type ExtractFunctionReturnType } from '../../../../services/user.service';
import { getAccountWithTransactions } from '../../../../services/plaid.service';
import Transaction from './Transaction';

type AccountWithTransactions = ExtractFunctionReturnType<typeof getAccountWithTransactions>
export const TransactionList = (props: {
  account: AccountWithTransactions;
}) => {
  return (
    <div class="animate-fade-in">
      {props.account.transactions.map((transaction) => (
        <Transaction
          transaction={transaction}
          tailwindColorClass={transaction.category.color}
        />
      ))}
    </div>
  );
};
