import { type TransactionSchema } from "../../../../interface/types";

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const Transaction = ({
  transaction,
  tailwindColorClass,
  route,
  checked,
  displayDate, // New prop to determine whether to display the date
  groupId,
  url,
}: {
  transaction: TransactionSchema;
  tailwindColorClass: string;
  route?: string;
  checked?: boolean;
  displayDate?: boolean; // New prop
  groupId?: string;
  url?: string;
}) => {
  if (!transaction) throw new Error("404");
  const hxAttr =
    route === "AddTransaction"
      ? {
          "hx-post": `/transactions/addButton?checked=${checked}&transactionId=${transaction.id}&groupId=${groupId}`,
        }
      : {
          "hx-get": `/transactions/details/${transaction.id}/?url=${url}`,
          "hx-push-url": `/transactions/details/${transaction.id}/?url=${url}`,
        };

  return (
    <button
      id={`transactionContainer-${transaction.id}`}
      {...hxAttr}
      hx-trigger="click"
      hx-target={`${
        route === "AddTransaction"
          ? `#transactionContainer-${transaction.id}`
          : "#app"
      }`}
      hx-swap={route === "AddTransaction" ? "outerHTML" : "innerHTML"}
      data-id={transaction.id}
      data-company={transaction.company}
      class={`transaction rounded-xl w-full h-fit`}
    >
      {displayDate && (
        <div class="text-font-off-white font-semibold mb-2">
          {transaction.timestamp && formatDate(transaction.timestamp)}
        </div>
      )}
      <div
        class={`${tailwindColorClass} rounded-2xl mt-2 w-[calc(100%_-_2px)]`}
      >
        <div class="w-[calc(100%_+_2px)] right-px hover:-translate-y-0.5 cursor-pointer transition-transform mt-2 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between relative rotate-[0.00001deg]">
          <div class="flex items-center">
            <div class={`p-3 pl-4 pr-4 mr-4 ${tailwindColorClass} rounded-xl`}>
              <div class="flex items-center justify-center w-10 h-10">
                <img src={transaction.category.icon} alt="" class="w-10" />
              </div>
            </div>
            <div>
              <h4 class="text-font-off-white font-semibold w-fit text-left">
                {transaction.company &&
                  (transaction.company.length > 24
                    ? transaction.company.slice(0, 23) + "..."
                    : transaction.company)}
              </h4>
              <p class="text-gray-400 text-sm text-font-off-white w-fit">
                {transaction.timestamp && formatDate(transaction.timestamp)}
              </p>
              {/* @ts-ignore */}
              {groupId && transaction.user?.firstName && (
                <p class="text-font-off-white font-semibold w-fit text-left">
                  {/* @ts-ignore */}
                  {transaction.user.firstName}
                </p>
              )}
            </div>
          </div>
          <div
            class={`text-font-off-white text-lg font-semibold ${
              route === "AddTransaction" ? "mr-1" : "mr-4"
            }`}
          >
            {(transaction.amount > 0 ? "-$" : "$") +
              Math.abs(transaction.amount).toFixed(2)}
          </div>
          {route === "AddTransaction" && (
            <div class="right-0 bg-font-off-white rounded-full p-2 cursor-pointer hover:-translate-y-0.5 transition-transform hover:opacity-80 rotate-[0.00001deg]">
              <img
                src={`/icons/${checked ? "check.svg" : "addTransaction.svg"}`}
                alt="Plus Icon"
                class="w-4 text-primary-black-page"
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default Transaction;
