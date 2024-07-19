import { Transaction } from "../../transactions/components/Transaction";
import { type GroupWithTransactions } from "../../../../services/group.service";
import Members from "./Members";
import OwedGroup from "./OwedGroup";
import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import PendingItems from "./PendingItem";

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
  selectedDepositAccountId,
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
  selectedDepositAccountId: string | null;
  itemId?: string;
  url: string;
}) => {
  const calculateTotalOwed = (
    owedPerMember: ExtractFunctionReturnType<
      typeof getAllOwedForGroupTransactionWithTransactionId
    >[],
    currentUser: UserSchema
  ) => {
    return owedPerMember
      .map((owedList) =>
        owedList.find((owed) => owed.userId === currentUser.id)
      )
      .filter((owed) => owed && !owed.pending)
      .reduce((total, owed) => total + owed!.amount, 0);
  };
  const totalOwed = calculateTotalOwed(owedPerMember, currentUser);

  return (
    <div>
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
          <h1 class="text-xl h-fit text-font-off-white mb-[0.69rem]">
            Members
          </h1>
          <div class="flex flex-wrap items-center">
            <Members
              memberDetails={members}
              currentUser={currentUser}
              owedPerMember={owedPerMember.map((owedPerMember) =>
                owedPerMember.filter((owed) => !owed.pending)
              )}
            />
          </div>
          <div class="flex flex-row mt-[1.90rem]">
            <button
              class="hover:-translate-y-0.5 w-[6rem] h-[2rem]
           transition-transform text-font-off-white px-5
           rounded-lg shadow-lg hover:bg-blue-600 flex flex-row
           justify-center font-normal border-font-off-white border-[2px] mr-[0.90rem]"
            >
              <p class="self-center my-[0.8rem]">Expenses</p>
            </button>
            {/*
            <button
              class="hover:-translate-y-0.5 w-[6rem] h-[2rem]
           transition-transform text-font-off-white px-5
           rounded-lg shadow-lg hover:bg-blue-600 flex flex-row
           justify-center font-normal bg-primary-black mr-[0.90rem]"
            >
              <p class="self-center my-[0.8rem]">Budget</p>
            </button>
            <button
              class="hover:-translate-y-0.5 w-[6rem] h-[2rem]
           transition-transform text-font-off-white px-5
           rounded-lg shadow-lg hover:bg-blue-600 flex flex-row
           justify-center font-normal bg-primary-black"
            >
              <p class="self-center my-[0.8rem]">Totals</p>
            </button>
          */}
          </div>
          <div class="my-3 h-[1px] bg-primary-dark-grey rounded w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
          <PendingItems
            memberDetails={members}
            currentUser={currentUser}
            transactions={transactions}
            owedPerMember={owedPerMember}
            groupId={groupId}
            selectedAccountId={selectedDepositAccountId}
          />
          <OwedGroup
            totalOwed={totalOwed}
            memberDetails={members}
            currentUser={currentUser}
            transactions={transactions}
            owedPerMember={owedPerMember
              .map((owed) => owed.filter((owed) => owed.amount > 0))
              .filter((owed) => owed.length > 0)}
            groupId={groupId}
            url={url}
          />
          {/* <p class="text-font-off-white text-2xl pt-3
            pb-1">Budget</p> <BudgetChart groupBudget={groupBudget} /> */}
        </div>
        <OwedGroup
          totalOwed={totalOwed}
          memberDetails={members}
          currentUser={currentUser}
          transactions={transactions}
          owedPerMember={owedPerMember
            .map((owed) => owed.filter((owed) => owed.amount < 0))
            .filter((owed) => owed.length > 0)}
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
            groupId={groupId}
            url={`/groups/view/${groupId}`}
          />
        ))}{" "}
      </div>
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
