import type { AccountWithTransactions } from "../../../../services/plaid.service";
import {
  generatePathStyles,
  mapTransactionsToCategories,
} from "../../Breakdown/BreakdownPage";
import { Graph } from "../../Breakdown/components/TotalExpenses/Graph";
import Transaction from "./Transaction";
import { type TransactionSchema } from "../../../../interface/types";

function firstLetterCapital(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const AccountOverview = ({
  account,
  lastMonth,
}: {
  account: AccountWithTransactions;
  lastMonth?: boolean;
}) => {
  // Assuming `mapTransactionsToCategories` and `generatePathStyles` should be called for each account's transactions
  const categories = mapTransactionsToCategories(account.transactions);
  categories.sort((a, b) => b.cost - a.cost);
  const pathStyles = generatePathStyles(categories);

  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth() + (lastMonth ? 0 : 1);
  currentDate.setMonth(currentMonthNumber);
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  function validateTransactions(transactions: TransactionSchema[]) {
    const hasTransactions = transactions.length > 0;
    const hasNegativeAmount = transactions.some(
      (transaction) => transaction.amount > 0
    );

    return hasTransactions && hasNegativeAmount;
  }
  return (
    <>
      <div
        id={`accountOverview-${account.id} `}
        class="bg-primary-black bg-opacity-40 rounded-md flex flex-col p-2 py-4 my-4 justify-center text-sm animate-fade-in"
      >
        <div class="account-info flex justify-between text-font-off-white mx-1 text-md">
          <p class="font-semibold">
            {account.name}{" "}
            {/* this is borked rn
            <span class="font-normal">
              (
              {account.accountTypeId ? account.accountTypeId.slice(-4) : "1111"}
              )
            </span>
            */}
          </p>
          <div class="flex">
            <p class="font-semibold mr-2">Account Type:</p>
            <p>
              {account.accountTypeId
                ? firstLetterCapital(account.accountTypeId)
                : account.accountTypeId}
            </p>
          </div>
        </div>
        {account.itemId ? (
          <div
            class="balance flex flex-col text-font-off-white text-center 
        justify-center mt-2 mb-1"
          >
            <p class="text-lg">Current Balance</p>
            <p class="text-2xl font-semibold">
              {"$" + parseFloat(account.balance!).toFixed(2)}
            </p>
          </div>
        ) : (
          <div
            class="balance flex flex-col text-font-off-white text-center 
        justify-center mt-2 mb-1"
          >
            <p class="text-2xl font-semibold">
              These are manually added transactions
            </p>
          </div>
        )}
        <div class="w-full h-[1px] bg-font-grey rounded mb-2 opacity-50"></div>
        <div class="transactions flex flex-col">
          {account.transactions
            .reverse()
            .slice(0, 2)
            .map((transaction) => (
              <Transaction
                transaction={transaction}
                tailwindColorClass={transaction.category.color}
                url={"/home/page/default"}
              />
            ))}
          <p
            hx-get={`/transactions/page/${account.itemId}/${account.id}`}
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-target="#app"
            hx-push-url={`/transactions/page/${account.itemId}/${account.id}`}
            class="text-font-off-white self-end mt-2 cursor-pointer"
          >
            View All
          </p>
        </div>

        <div class="p-6 text-font-off-white bg-primary-black rounded-lg mt-4">
          {validateTransactions(account.transactions) ? (
            <>
              <p class="text-xl font-semibold">
                Monthly Breakdown - {currentMonth}
              </p>
              <Graph slices={pathStyles} accountId={account.id} home />
              <div class="flex flex-row justify-center mt-6">
                <button
                  hx-swap="innerHTML"
                  hx-get={`/breakdown/page/${account.id}`}
                  hx-target="#app"
                  hx-push-url={`/breakdown/page/${account.id}`}
                  class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl w-2/3"
                >
                  More Info
                </button>
              </div>
            </>
          ) : (
            <p class="text-xl font-semibold">No transactions to show</p>
          )}
        </div>
      </div>
    </>
  );
};
