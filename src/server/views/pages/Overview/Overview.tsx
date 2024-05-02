import { Transaction } from '../transactions/components/transaction';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  company: string;
  amount: number;
  timestamp: string;
  category: Category;
}

export const Overview = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div class="p-6">
      {' '}
      {/*Margin left and right might become a div later for cleaner code*/}
      <h1 class="text-2xl text-font-off-white pt-2"> Welcome, Holden</h1>{' '}
      {/*Holden will be name variable*/}
      <div class="bg-primary-black relative">
        <div class="pl-4 mt-3 py-2 flex justify-between items-center">
          <div>
            <p class="text-base text-font-off-white">Overview</p>
            <p class="text-2xl text-font-off-white">$8,987.32</p>
            <p class="text-xs text-font-off-white">Contributions</p>
          </div>
          <span class="absolute top-3 right-3">
            <img
              src="/images/InfoIcon.svg"
              alt="Informational Icon"
              class="w-3.5 h-3.5"
            ></img>
          </span>
        </div>
      </div>
      <p class="flex items-center text-xl text-font-off-white mt-2">
        My Accounts{' '}
        <img
          src="/images/addcircle.svg"
          alt="Add Icon"
          class="mt-2.5 h-8"
        ></img>
      </p>
      <div class="bg-primary-black relative">
        <div class="ml-4 mt-3 py-2 flex justify-between items-center">
          <p class="text-base text-font-off-white">
            Bank<span class="text-sm text-font-off-white">(1000)</span>
          </p>
        </div>
        <div class="flex justify-center">
          <p class="text-base text-font-off-white">$2,344.10</p>
        </div>
        <hr class="mx-3 h-0.5 bg-font-off-white"></hr>
        <p class="ml-4 mt-2 text-base text-font-off-white">Monthly Breakdown</p>
      </div>
      <div>
        <div class="flex flex-row justify-between text-center items-center mb-0 underline">
          <p class="text-xl text-font-off-white mt-3">Transaction History</p>
          <a
            hx-get="/transactions"
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            class="text-font-off-white cursor-pointer hover:opacity-90"
          >
            View All
          </a>
        </div>
        {transactions.map((transaction: Transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
      <div class="h-20"></div>
    </div>
  );
};
