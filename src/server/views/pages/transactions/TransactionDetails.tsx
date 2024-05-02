import { type Transactions } from "../../../routes/indexRouter";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const TransactionDetailsPage = ({
  transaction,
}: {
  transaction: ArrayElement<Transactions>;
}) => {
  return (
    <div class="p-6">
      <div class="flex justify-start w-fit items-center mb-8">
        <a
          hx-get="/transactions"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white"
        >
          &#8592;
        </a>
      </div>
      <div class="flex justify-center flex-col items-center">
        <p class="text-3xl text-font-off-white mb-2">
          ${transaction.transactions.amount}
        </p>
        <div class="text-font-grey text-xl">1527 Main St, Vancouver, BC V6A 2W5</div>
        <div class="bg-primary-dark-grey rounded-lg shadow-lg p-6 w-full">
          <div class="text-font-grey text-lg font-semibold">
            Status: <span class="text-green-600">Approved</span>
          </div>
          <div class="text-font-grey text-sm mt-1">Scotiabank Interac debit</div>
          <div class="flex justify-between bg-primary-dark-grey">
            <span class="text-font-grey text-lg font-semibold">Total</span>
            <span class="text-font-grey text-lg font-semibold">
              {transaction.transactions.amount}
            </span>
          </div>
          </div>
          <div class="mt-6 w-full h-auto rounded-lg bg-primary-dark-grey">
            <img src="./map/map-screenshot.png" class="rounded-t-lg"/>
            <p class="text-font-grey">{transaction.transactions.company} #{transaction.transactions.id}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
