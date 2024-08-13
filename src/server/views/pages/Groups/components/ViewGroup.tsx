import { Transaction } from "../../transactions/components/Transaction";
import { type GroupWithTransactions } from "../../../../services/group.service";
import Members from "./Members";
import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import { OwedOwingHistory } from "./OwedOwingHistory";

interface groupBudget {
  budgetGoal: number;
  spending: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  color: string;
  createdAt: string;
  type: string;
}

export const ViewGroups = ({
  transactions,
  members,
  currentUser,
  groupId,
  owedPerMember,
  accountId,
  itemId,
  url,
}: {
  groupId: string;
  transactions: GroupWithTransactions;
  members: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  groupBudget: groupBudget[];
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];
  accountId: string;
  itemId?: string;
  url: string;
}) => {
  return (
    <div class="animate-fade-in">
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
          hx-get={`/groups/addMembers/${groupId}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/edit/${groupId}`}
          class="text-font-off-white text-4xl cursor-pointer flex "
        >
          <img
            src="/icons/threeDot.svg"
            alt="More Icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6 justify-end"
          />
        </a>
      </div>
      <div class="mt-[1.31rem]">
        <h1 class="text-xl h-fit text-font-off-white mb-[0.69rem]">Members</h1>
        <div class="flex flex-wrap items-center">
          <Members
            memberDetails={members}
            currentUser={currentUser}
            owedPerMember={owedPerMember.map((owedPerMember) =>
              owedPerMember.filter((owed) => !owed.pending)
            )}
          />
        </div>
        <OwedOwingHistory
          selectedTab="owed"
          url={url}
          groupId={groupId}
          owedPerMember={owedPerMember}
          transactions={transactions}
          members={members}
          currentUser={currentUser}
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
            groupId={groupId}
            url={`/groups/view/${groupId}`}
          />
        ))}{" "}
      </div>
      <div class="w-full h-fit fixed bottom-32 left-0 flex flex-row justify-center">
        <button
          hx-get={
            itemId
              ? `/groups/addTransaction/${accountId}/${groupId}/${itemId}`
              : `/groups/addTransaction/${accountId}/${groupId}`
          }
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-push-url={`/groups/addTransaction/${accountId}/${groupId}`}
          class="hover:-translate-y-0.5
            transition-transform bg-accent-blue text-font-off-white px-8
            py-4 rounded-lg hover:bg-blue-600 flex flex-row
            justify-center font-semibold drop-shadow-xl items-center"
        >
          {" "}
          <p class="text-lg">Add Expense</p>{" "}
          <img
            src="/icons/addExpenseCircle.svg"
            alt="Add Expense Icon"
            class=" hover:opacity-80 h-6 justify-end pl-0.5 ml-1"
          />
        </button>{" "}
      </div>
      <div class="h-16"></div>{" "}
    </div>
  );
};
