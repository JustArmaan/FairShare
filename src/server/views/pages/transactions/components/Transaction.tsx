import { type TransactionSchema } from '../../../../interface/types';

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
  transaction: TransactionSchema;
  tailwindColorClass: string;
}) => {
  if (!transaction) throw new Error('404');
  return (
    <a
      hx-get={`/transactions/details/${transaction.id}`}
      hx-trigger="click"
      hx-target="#app"
      hx-swap="innerHTML"
      hx-push-url="true"
    >
      <div class="hover:-translate-y-0.5 cursor-pointer transition-all mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between">
        <div class="flex items-center">
          <div class={`p-3 pl-4 pr-4 mr-4 ${tailwindColorClass} rounded-xl`}>
            <div class="flex items-center justify-center w-10 h-10">
              <img
                src={transaction.category.icon}
                alt="category icon for transaction"
                class="w-10"
              />
            </div>
          </div>
          <div>
            <h4 class="text-font-off-white font-semibold">
              {transaction.company.split(' ')[0].split(',')[0]}
            </h4>
            <p class="text-gray-400 text-sm text-font-off-white">
              {formatDate(transaction.timestamp)}
            </p>
          </div>
        </div>
        <div class="text-font-off-white text-lg font-semibold mr-4">
          -${Math.abs(transaction.amount).toFixed(2)}
        </div>
      </div>
    </a>
  );
};

export default Transaction;
