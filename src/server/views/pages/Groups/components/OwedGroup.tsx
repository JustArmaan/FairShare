import { group } from "console";
import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const OwedGroup = ({
  currentUser,
  transactions,
  owedPerMember,
  groupId,
}: {
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
  const owedForThisMember = owedPerMember
    .map((owedList) => owedList.find((owed) => owed.userId === currentUser.id)!)
    .filter((owed) => !owed.pending);
  return (
    <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center bg-primary-black relative">
      {transactions &&
        (transactions.length > 0 && owedForThisMember.length > 0 ? (
          owedForThisMember
            .map((owedList) => ({
              ...owedList,
              transaction: transactions.find(
                (transaction) => transaction.id === owedList.transactionId
              )!,
            }))
            .map((result, index) => (
              <div class="my-2 w-full">
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                    {maxCompanyNameLength(result.transaction.company ?? "", 20)}
                  </p>
                  <p class="text-font-off-white self-end w-fit text-lg">
                    {result.amount > 0 ? "You're Owed " : "You Owe "}
                    <span
                      class={`text-lg font-medium ${
                        result.amount > 0
                          ? "text-positive-number"
                          : "text-negative-number"
                      }`}
                    >
                      ${result.amount.toFixed(2)}
                    </span>
                  </p>
                </div>
                <p class="text-font-off-white self-start text-xs">
                  {result.transaction.timestamp}
                </p>
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start mt-2">
                    Paid by:{" "}
                    <span class="text-font-off-white self-start mt-2 font-semibold">
                      {currentUser.firstName}
                      {/* This needs to be whoever paid for the bill */}
                    </span>
                  </p>
                  <div class="flex flex-row justify-center text-font-off-white">
                    {result.amount > 0 ? (
                      <button
                        hx-swap="innerHTML"
                        hx-get={`/groups/details/${result.groupTransactionToUsersToGroupsId}/${groupId}`}
                        hx-target="#app"
                        class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl h-fit"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        hx-swap="innerHTML"
                        hx-get={`/groups/pay/${result.groupTransactionToUsersToGroupsId}/${groupId}`}
                        hx-target="#app"
                        class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl h-fit"
                      >
                        View and Pay
                      </button>
                    )}
                  </div>
                </div>
                {index !== transactions.length - 1 && (
                  <div class="mt-4 h-[1px] bg-primary-grey rounded w-full"></div>
                )}
              </div>
            ))
        ) : (
          <p class="text-font-grey text-lg">No outstanding expenses.</p>
        ))}
    </div>
  );
};
export default OwedGroup;
