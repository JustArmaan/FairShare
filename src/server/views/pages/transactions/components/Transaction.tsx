import { type Transactions } from '../../../../routes/indexRouter';

function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const Transaction = ({
  transaction,
  tailwindColorClass,
}: {
  transaction: ArrayElement<Transactions>;
  tailwindColorClass: string;
}) => {
  return (
    <a
      hx-get="/transactionDetails"
      hx-trigger="click"
      hx-target="#app"
      hx-swap="innerHTML"
    >
      <div class="mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between max-w-xl">
        <div class="flex items-center">
          <div class={`p-3 pl-4 pr-4 mr-4 ${tailwindColorClass} rounded-xl`}>
            <div class="flex items-center justify-center w-10 h-10">
              <img
                src={transaction.categories.icon}
                alt="category icon for transaction"
                class="w-10"
              />
            </div>
          </div>
          <div>
            <h4 class="text-font-off-white font-semibold">
              {transaction.transactions.company.split(' ')[0].split(',')[0]}
            </h4>
            <p class="text-gray-400 text-sm text-font-off-white">
              {formatDate(transaction.transactions.timestamp)}
            </p>
          </div>
        </div>
        <div class="text-font-off-white text-lg font-semibold mr-4">
          -${Math.abs(transaction.transactions.amount).toFixed(2)}
        </div>
      </div>
    </a>
  );
};

export default Transaction;
