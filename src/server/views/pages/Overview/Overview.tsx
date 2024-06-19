import { Transaction } from "../transactions/components/Transaction";
import { type TransactionSchema } from "../../../interface/types";
import { Graph } from "../Breakdown/components/TotalExpenses/Graph";
import {
  generatePathStyles,
  mapTransactionsToCategories,
} from "../Breakdown/BreakdownPage";

interface UserDetails {
  userName: string;
  totalAmount: string;
  cardsAmount: string[];
}

export const Overview = ({
  transactions,
  userDetails,
}: {
  transactions: TransactionSchema[];
  userDetails: UserDetails;
}) => {
  const categories = mapTransactionsToCategories(transactions);
  const pathStyles = generatePathStyles(categories);
  return (
    <div class="p-6 animate-fade-in">
      {" "}
      <h1 class="text-2xl text-font-off-white pt-2">
        {" "}
        Welcome, {userDetails.userName}
      </h1>{" "}
      <div class="rounded-lg pl-4 mt-3 py-2 flex justify-between items-center bg-primary-black relative">
        <div>
          <p class="text-base text-font-off-white">Total Balance</p>
          <p class="text-2xl text-font-off-white">
            $
            {categories
              .reduce((sum, category) => category.cost + sum, 0)
              .toFixed(2)}
          </p>
        </div>
        {/*
        <span class="absolute top-3 right-3">
          <img
            src="/images/InfoIcon.svg"
            alt="Informational Icon"
            class="w-3.5 h-3.5"
          ></img>
        </span>
        */}
      </div>
      <p class="flex items-center text-xl text-font-off-white mt-2">
        My Accounts{" "}
        <img
          src="/images/addcircle.svg"
          alt="Add Icon"
          class="mt-2.5 h-8"
        ></img>
      </p>
      <div class="rounded-lg bg-primary-black ">
        <div class="ml-4 mt-3 py-2 flex justify-between items-center">
          <p class="text-lg font-semibold text-font-off-white">
            ScotiaBank{" "}
            <span class="text-sm font-medium text-font-off-white">(1465)</span>
          </p>
        </div>
        <div class="flex justify-center">
          <p class="text-3xl text-font-off-white font-semibold mb-1">
            $
            {categories
              .reduce((sum, category) => category.cost + sum, 0)
              .toFixed(2)}
          </p>
        </div>
        <div class="mx-3 h-[3px] bg-primary-grey rounded"></div>
        <div class="p-6 text-font-off-white">
          <p class="text-xl font-semibold">Monthly Breakdown</p>
          <Graph slices={pathStyles} />
          <div class="flex flex-row justify-center mt-6">
            <button
              hx-swap="innerHTML"
              hx-get="/breakdown/page"
              hx-target="#app"
              // rotate 0.0001deg prevents strange subpixel snapping during animation when viewport is 430px wide. I spent 15 mins on this.
              // https://stackoverflow.com/questions/24854640/strange-pixel-shifting-jumping-in-firefox-with-css-transitions
              class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl w-2/3"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="flex flex-row justify-between text-center items-center mb-0 mt-3">
          <p class="text-xl text-font-off-white">Transaction History</p>
          <a
            hx-get="/transactions/page/itemId/accountId"
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            class="text-font-off-white cursor-pointer hover:opacity-90 hover:-translate-y-px transition-transform"
          >
            View All
          </a>
        </div>
        {transactions.map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
          />
        ))}
      </div>
      <div class="h-20"></div>
    </div>
  );
};
