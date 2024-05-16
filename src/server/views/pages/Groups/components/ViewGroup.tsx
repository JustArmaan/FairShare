import { Transaction } from '../../transactions/components/Transaction';
import { type GroupWithTransactions } from '../../../../services/group.service';
import Members from './Members';
import OwedGroup from './OwedGroup';
import { type UserSchema } from '../../../../interface/types';
import BudgetChart from './BudgetChart';
const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
];

interface groupBudget {
  budgetGoal: number;
  spending: number;
}

export const ViewGroups = ({
  transactions,
  members,
  currentUser,
  groupBudget,
  groupId,
  transactionSum,
}: {
  groupId: string;
  transactions: GroupWithTransactions;
  members: UserSchema[];
  currentUser: UserSchema;
  groupBudget: groupBudget[];
  transactionSum: number;
}) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between">
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer w-fit"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>{' '}
        <a
          hx-get={`/groups/edit/${groupId}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer flex "
        >
          <img
            src="/icons/edit.svg"
            alt="More Icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6 justify-end"
          />
        </a>
      </div>
      <div class="mt-4 mb-24">
        <h1 class="text-2xl text-font-off-white pt-3 pb-1"> Members</h1>{' '}
        <div class="flex flex-wrap items-center">
          <Members
            memberDetails={members}
            currentUser={currentUser}
            transactionSum={transactionSum}
          />
        </div>
        <p class="text-font-off-white text-2xl pt-3">Owing</p>
        <OwedGroup
          memberDetails={members}
          currentUser={currentUser}
          transactions={transactions}
        />
        <p class="text-font-off-white text-2xl pt-3 pb-1">Budget</p>
        <BudgetChart groupBudget={groupBudget} />
        <div class="flex justify-between align-center text-center pt-3">
          <p class="text-font-off-white text-2xl">Recent Expenses</p>
          <p
            hx-get={`/groups/transactions/${groupId}`}
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            class="text-font-off-white cursor-pointer"
          >
            View All
          </p>
        </div>
        {transactions.slice(0, 4).map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
          />
        ))}
      </div>
      <button
        hx-get={`/groups/addTransaction/${groupId}`}
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        class="fixed bottom-24 right-6 hover:-translate-y-0.5 transition-transform bg-[#F9F9F9] text-font-grey px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 flex flex-row justify-center"
      >
        <p>Add Expense</p>
        <img
          src="/icons/addExpenseCircle.svg"
          alt="Add Expense Icon"
          class=" hover:opacity-80 h-6 justify-end pl-0.5"
        />
      </button>
      <div class="h-16"></div>
    </div>
  );
};
