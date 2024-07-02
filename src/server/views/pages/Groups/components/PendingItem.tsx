import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const PendingItems = ({
  currentUser,
  transactions,
  owedPerMember,
  groupId,
}: {
  selectedAccountId: string | null;
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions?: GroupWithTransactions;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];
  groupId: string;
}) => {
  function maxCompanyNameLength(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  }

  function firstLetterUppercase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center">
      {transactions &&
        (transactions.length > 0 &&
        owedPerMember
          .map(
            (owedList) =>
              owedList.find((owed) => owed.userId === currentUser.id)!
          )
          .filter((owed) => owed && owed.pending && owed.amount > 0).length >
          0 ? (
          owedPerMember
            .map(
              (owedList) =>
                owedList.find((owed) => owed.userId === currentUser.id)!
            )
            .filter((owed) => owed.pending && owed.amount > 0)
            .map((owedList) => ({
              ...owedList,
              transaction: transactions.find(
                (transaction) => transaction.id === owedList.transactionId
              )!,
            }))
            .map((result) => (
              <div class="w-full bg-primary-black relative mb-3 rounded-md h-[7rem] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                <div class="p-3">
                  <div class="flex justify-between w-full">
                    <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                      {maxCompanyNameLength(
                        result.transaction.company ?? "",
                        20
                      )}
                    </p>
                    <p class="text-font-off-white self-end w-fit text-lg">
                      Split:{" "}
                      <span class="text-lg font-medium">
                        {firstLetterUppercase(result.transaction.type)}
                      </span>
                    </p>
                  </div>
                  <p class="text-font-off-white self-start text-xs">
                    {result.transaction.timestamp}
                  </p>
                  <div class="flex justify-between w-full">
                    <p class="text-font-off-white self-start mt-2 mb-2">
                      Total:{" "}
                      <span class="text-font-off-white self-start mt-2 font-semibold">
                        ${Math.abs(result.transaction.amount).toFixed(2)}
                        {/* This needs to be whoever paid for the bill */}
                      </span>
                    </p>
                    <button
                      hx-swap="innerHTML"
                      hx-get={`/groups/confirm-transaction/?owedId=${result.groupTransactionToUsersToGroupsId}`}
                      hx-target="#app"
                      hx-push-url={`/groups/confirm-transaction/?owedId=${result.groupTransactionToUsersToGroupsId}`}
                      class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold py-3 px-8 bg-accent-blue rounded-xl h-fit text-font-off-white"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p class="text-font-grey text-lg">No pending expenses.</p>
        ))}
    </div>
  );
};
export default PendingItems;
