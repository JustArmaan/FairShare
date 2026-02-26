import { PendingItems } from "./PendingItem";
import { OwedGroup } from "./OwedGroup";
import type {
  UserSchema,
  UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { GroupWithTransactions } from "../../../../services/group.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { getGroupTransactionDetails } from "../../../../services/owed.service";

export const tabs = ["owed", "owing", "history"] as const;

export const OwedOwingHistory = (props: {
  members: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  transactions: GroupWithTransactions;
  groupId: string;
  url: string;
  selectedTab: (typeof tabs)[number];
  resultPerGroupTransaction: ExtractFunctionReturnType<
    typeof getGroupTransactionDetails
  >[];
}) => {
  const buttonBaseClasslist =
    "rotate-[0.00001deg] bg-primary-black hover:-translate-y-0.5 w-[6rem] h-[2rem] transition-transform text-font-off-white px-5 rounded-lg shadow-lg hover:bg-blue-600 flex flex-row justify-center font-normal mr-[0.90rem]";
  const buttonSelectedClasslist = "border-[3px] border-font-off-white";
  const buttonUnselectedClasslist =
    "bg-primary-black border-[3px] border-primary-black-page";

  function calculateTransactionCount(tab: string) {
    const owing = tab === "owing";

    const filtered = props.resultPerGroupTransaction.filter(
      (groupStateResult) => {
        const ourTransaction = groupStateResult.find(
          (result) => result.users.id === props.currentUser.id
        );

        if (!ourTransaction) return false;

        return owing
          ? ourTransaction!.groupTransactionToUsersToGroups.amount < 0 &&
              ourTransaction!.groupTransactionToUsersToGroupsStatus.status ===
                "notSent"
          : ourTransaction!.groupTransactionToUsersToGroups.amount > 0;
      }
    );

    const processedData = filtered.map((owedList) =>
      owedList.reduce(
        (acc, owed) => {
          if (owed.groupTransactionToUsersToGroups.amount > 0)
            acc.user = owed.users;

          if (!acc.company) acc.company = owed.transactions.company!;

          if (owed.users.id === props.currentUser.id) {
            acc.groupTransactionToUsersToGroupsId =
              owed.groupTransactionToUsersToGroups.id;
          }

          if (!owing) {
            acc.amount +=
              owed.users.id === props.currentUser.id
                ? owed.groupTransactionToUsersToGroups.amount
                : 0;
          }

          return acc;
        },
        {
          amount: owing
            ? owedList.find((owed) => owed.users.id === props.currentUser.id)
                ?.groupTransactionToUsersToGroups.amount
            : 0,
          company: owedList[0].transactions.company!,
          timestamp: owedList[0].transactions.timestamp,
        } as {
          company: string;
          user: UserSchema;
          amount: number;
          groupTransactionToUsersToGroupsId: string;
          timestamp: string;
        }
      )
    );
    return processedData.length;
  }

  return (
    <div id="owed-owing-history" data-selected-tab={props.selectedTab}>
      <div class="flex flex-row mt-[1.90rem]">
        {tabs.map((tab) => {
          const transactionCount = calculateTransactionCount(tab);

          return (
            <button
              class={`${buttonBaseClasslist} ${
                props.selectedTab === tab
                  ? buttonSelectedClasslist
                  : buttonUnselectedClasslist
              }`}
              hx-get={`/groups/view/OwedOwingHistory?groupId=${props.groupId}&tab=${tab}`}
              hx-trigger={props.selectedTab !== tab ? "click" : "none"}
              hx-swap="outerHTML"
              hx-target="#owed-owing-history"
            >
              <p class="self-center my-[0.8rem]">
                {[
                  tab.split("")[0].toUpperCase(),
                  ...tab.split("").slice(1),
                ].join("")}
              </p>
              {tab !== "history" && calculateTransactionCount(tab) !== 0 && (
                <div class="flex items-center justify-center absolute border-primary-black border-2 -right-1.5 -top-2 bg-accent-red h-5 rounded-full aspect-square">
                  <p class="text-xs font-semibold leading-none relative top-0.5">
                    {transactionCount > 9
                      ? `${transactionCount}+`
                      : transactionCount}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div class="my-3 h-[1px] bg-primary-dark-grey rounded w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
      <PendingItems
        memberDetails={props.members}
        currentUser={props.currentUser}
        transactions={props.transactions}
        groupId={props.groupId}
        resultPerGroupTransaction={props.resultPerGroupTransaction}
      />
      {props.selectedTab !== "history" && (
        <OwedGroup
          owing={props.selectedTab === "owing"}
          memberDetails={props.members}
          currentUser={props.currentUser}
          transactions={props.transactions}
          groupId={props.groupId}
          url={props.url}
          resultPerGroupTransaction={props.resultPerGroupTransaction}
        />
      )}
    </div>
  );
};
