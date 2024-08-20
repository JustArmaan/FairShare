import type { ItemsWithTransactions } from "./LinkTransfer";
import type { ArrayElement } from "../../transactions/components/Transaction";
import { Transaction } from "../../transactions/components/Transaction";

export const TransactionSelector = (props: {
  itemWithTransactions: ArrayElement<ItemsWithTransactions>;
  selectedTransactionId: string | null;
}) => {
  return (
    <div id="transaction-picker-container" class="flex flex-col mt-8">
      <p>Choose Transaction:</p>
      {props.itemWithTransactions.transactions
        .filter(
          (transaction) =>
            transaction.amount > 0 &&
            transaction.category.name === "TRANSFER_OUT"
        )
        .sort((a, b) => {
          const score =
            (new Date(b.timestamp!) as unknown as number) -
            (new Date(a.timestamp!) as unknown as number);
          if (score === 0) {
            return b.company!.localeCompare(a.company!);
          }
          return score;
        })
        .map((transaction) => {
          const selected = props.selectedTransactionId === transaction.id;

          return (
            <div
              class="relative cursor-pointer"
              hx-get={
                props.selectedTransactionId === transaction.id
                  ? `/split/transactionSelector?transactionId=default&itemId=${props.itemWithTransactions.item.id}`
                  : `/split/transactionSelector?transactionId=${transaction.id}&itemId=${props.itemWithTransactions.item.id}`
              }
              hx-trigger="click"
              hx-target="#transaction-picker-container"
              hx-swap="outerHTML"
            >
              {!selected && props.selectedTransactionId !== null && (
                <div class="absolute top-0 left-[-1px] w-[calc(100%_+_2px)] h-[calc(100%_-_12px)] rounded-md bg-primary-black-page z-50 opacity-50 mt-2 hover:opacity-0" />
              )}
              <span hx-disable>
                <Transaction
                  transaction={transaction}
                  tailwindColorClass={transaction.category.color}
                />
              </span>
            </div>
          );
        })}
      <button
        class={`${props.selectedTransactionId !== null ? "bg-accent-blue hover:-translate-y-0.5 pointer hover:transition-transform rotate-[0.00001deg]" : "bg-primary-dark-grey text-font-grey"} py-2 w-full rounded-md mt-8 mb-4`}
      >
        <p class="text-lg">Settle</p>
      </button>
    </div>
  );
};
