import { type TransactionSchema } from '../../../../interface/types';
import Transaction from './Transaction';

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
  'bg-accent-purple',
];

export const TransactionList = (props: {
  transactions: TransactionSchema[];
}) => {
  return (
    <div class="animate-fade-in">
      {props.transactions.map((transaction, categoryIndex) => (
        <Transaction
          transaction={transaction}
          tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
        />
      ))}
    </div>
  );
};
