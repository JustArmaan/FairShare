import type { AccountWithTransactions } from '../../../../services/plaid.service';
import {
  generatePathStyles,
  mapTransactionsToCategories,
} from '../../Breakdown/BreakdownPage';
import { Graph } from '../../Breakdown/components/TotalExpenses/Graph';
import Transaction from './Transaction';

  function firstLetterCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

export const AccountOverview = ({
  account,
}: {
  account: AccountWithTransactions;
}) => {
  // Assuming `mapTransactionsToCategories` and `generatePathStyles` should be called for each account's transactions
  const categories = mapTransactionsToCategories(account.transactions);
  const pathStyles = generatePathStyles(categories);

  return (
    <>
      <div class="bg-primary-black bg-opacity-40 rounded-lg flex flex-col p-2 py-4 my-4 justify-center text-sm">
        <div class="account-info flex justify-between text-font-off-white mx-1 text-md">
          <p class="font-semibold">
            {account.name} <span class="font-normal">(1111)</span>
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
        <div
          class="balance flex flex-col text-font-off-white text-center 
              justify-center mt-2 mb-1"
        >
          <p class="text-lg">Current Balance</p>
          <p class="text-2xl font-semibold">
            ${parseFloat(account.balance!).toFixed(2)}
          </p>
        </div>
        <div class="w-full h-[1px] bg-font-grey rounded mb-2 opacity-50"></div>
        <div class="transactions flex flex-col">
          {account.transactions.slice(0, 2).map((transaction) => (
            <Transaction
              transaction={transaction}
              tailwindColorClass={transaction.category.color}
            />
          ))}
          <p
            hx-get={`/transactions/page/${account.id}`}
            hx-trigger="click"
            hx-swap="innerHTML"
            hx-target="#app"
            class="text-font-off-white self-end mt-2 cursor-pointer"
          >
            View All
          </p>
        </div>

        <div class="p-6 text-font-off-white bg-primary-black rounded-lg mt-4">
          <p class="text-xl font-semibold">Monthly Breakdown</p>
          <Graph slices={pathStyles} />
          <div class="flex flex-row justify-center mt-6">
            <button
              hx-swap="innerHTML"
              hx-get={`/breakdown/page/${account.id}`}
              hx-target="#app"
              class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl w-2/3"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
