import { Transaction } from "../../transactions/components/Transaction";
import { type GroupWithTransactions } from "../../../../services/group.service";
import Members from "./Members";
import OwedGroup from "./OwedGroup";
import { type UserSchema } from "../../../../interface/types";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type {
  getAllOwedForGroupTransaction,
  getAllOwedForGroupTransactionWithTransactionId,
} from "../../../../services/owed.service";
import PendingItems from "./PendingItem";

interface groupBudget {
  budgetGoal: number;
  spending: number;
}

export const ViewGroups = ({
  transactions,
  members,
  currentUser,
  groupId,
  owedPerMember,
  accountId,
  selectedDepositAccountId,
  itemId,
  url,
}: {
  groupId: string;
  transactions: GroupWithTransactions;
  members: UserSchema[];
  currentUser: UserSchema;
  groupBudget: groupBudget[];
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];

  accountId: string;
  selectedDepositAccountId: string | null;
  itemId: string;
  url: string;
}) => {
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-between">
        <a
          hx-get="/groups/page"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url="/groups/page"
          class="text-font-off-white text-4xl cursor-pointer w-fit"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>{" "}
        <a
          hx-get={`/groups/edit/${groupId}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/edit/${groupId}`}
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
        <h1 class="text-2xl text-font-off-white pt-3 pb-1"> Members</h1>{" "}
        <div class="flex flex-wrap items-center">
          <Members
            memberDetails={members}
            currentUser={currentUser}
            owedPerMember={owedPerMember.map((owedPerMember) =>
              owedPerMember.filter((owed) => !owed.pending)
            )}
          />
        </div>
        <>
          <p class="text-font-off-white text-2xl pt-3">Pending</p>
          <PendingItems
            memberDetails={members}
            currentUser={currentUser}
            transactions={transactions}
            owedPerMember={owedPerMember}
            groupId={groupId}
            selectedAccountId={selectedDepositAccountId}
          />
        </>
        <p class="text-font-off-white text-2xl pt-3 mt-2">Owing</p>
        <OwedGroup
          memberDetails={members}
          currentUser={currentUser}
          transactions={transactions}
          owedPerMember={owedPerMember}
          groupId={groupId}
          url={url}
        />
        {/* <p class="text-font-off-white text-2xl pt-3
            pb-1">Budget</p> <BudgetChart groupBudget={groupBudget} /> */}
        <div
          class="flex justify-between align-center text-center
            pt-3"
        >
          {" "}
          <p class="text-font-off-white text-2xl">Recent Expenses</p>{" "}
          <p
            hx-get={`/groups/transactions/${groupId}`}
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            hx-push-url={`/groups/transactions/${groupId}`}
            class="text-font-off-white cursor-pointer"
          >
            {" "}
            View All{" "}
          </p>
        </div>{" "}
        {transactions.slice(0, 4).map((transaction) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={transaction.category.color}
            url={`/groups/view/${groupId}`}
          />
        ))}{" "}
      </div>
      <button
        hx-get={`/groups/addTransaction/${accountId}/${groupId}/${itemId}`}
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url={`/groups/addTransaction/${accountId}/${groupId}`}
        class="fixed bottom-24 right-6 hover:-translate-y-0.5
            transition-transform bg-accent-blue text-font-off-white px-6
            py-3 rounded-full shadow-lg hover:bg-blue-600 flex flex-row
            justify-center font-semibold"
      >
        {" "}
        <p>Add Expense</p>{" "}
        <img
          src="/icons/addExpenseCircle.svg"
          alt="Add Expense Icon"
          class=" hover:opacity-80 h-6 justify-end pl-0.5 ml-1"
        />
      </button>{" "}
      <div class="h-16"></div>{" "}
    </div>
  );
};
