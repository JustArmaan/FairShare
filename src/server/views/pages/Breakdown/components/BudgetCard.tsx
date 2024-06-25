import type { TransactionSchema } from "../../../../interface/types";
import Transaction from "../../transactions/components/Transaction";

export const BudgetCard = ({
  clipPathStyle,
  percentage,
  tailwindColorClass,
  totalCosts,
  title,
  transactions,
  url,
}: {
  clipPathStyle: string;
  tailwindColorClass: string;
  percentage: string;
  totalCosts: string;
  title: string;
  transactions: TransactionSchema[];
  url: string;
}) => {
  return (
    <div class="mt-6 rounded bg-primary-faded-black p-4 flex flex-col">
      <div class="items-center flex mb-2">
        <p class="text-2xl">{title}</p>
        <div class={`ml-4 rounded-full ${tailwindColorClass} w-5 h-5`}></div>
      </div>
      <p class="text-3xl tracking-tighter">${totalCosts}</p>
      <div class="flex w-full items-center flex-col mt-2">
        <p class="text-2xl mb-4 mt-4">{percentage}</p>
        <div class="bg-none drop-shadow-graph rounded-full w-3/5 aspect-square overflow-hidden relative hover:-translate-y-0.5 transition-transform">
          <div
            class={`hover:opacity-80 transition-all absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${tailwindColorClass} w-[150%] h-[150%]`} // min size of rectange is radius*sqrt(3), or (sqrt(3)*100)%, or roughly 173.2%
            style={clipPathStyle}
          ></div>
        </div>
      </div>
      <div class="mt-4">
        <p class="font-bold">Transactions</p>
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={tailwindColorClass}
            url={url}
          />
        ))}
      </div>
    </div>
  );
};
