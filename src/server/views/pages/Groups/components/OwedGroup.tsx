import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const OwedGroup = ({
  currentUser,
  transactions,
  owedPerMember,
  groupId,
  url,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions?: GroupWithTransactions;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];
  groupId: string;
  url?: string;
}) => {
  function maxCompanyNameLength(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  }
  const owedForThisMember = owedPerMember
    .map((owedList) => owedList.find((owed) => owed.userId === currentUser.id)!)
    .filter((owed) => owed && !owed.pending);

  function formatDate(dateString: string) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  return (
    <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center">
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
              <div class="w-full bg-primary-black relative mb-3 rounded-md min-h-[7rem] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                <div class="p-3">
                  <div class="flex justify-between w-full">
                    <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                      {maxCompanyNameLength(
                        result.transaction.company ?? "",
                        20
                      )}
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
                        ${Math.abs(result.amount).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <p class="text-font-off-white self-start text-xs">
                    {formatDate(result.transaction.timestamp!)}
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
                      <button
                        hx-swap="innerHTML"
                        hx-get={`/transactions/details/${result.transactionId}/?url=${url}`}
                        hx-push-url={`/transactions/details/${result.transactionId}/?url=${url}`}
                        hx-target="#app"
                        class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal w-[4.187rem] h-[2.063rem] border-accent-blue border-[2px] rounded-2xl text-font-off-white text-base"
                      >
                        View
                      </button>

                      <button
                        hx-swap="innerHTML"
                        hx-get={`/groups/pay/${result.groupTransactionToUsersToGroupsId}/${groupId}`}
                        hx-target="#app"
                        hx-push-url={`/groups/pay/${result.groupTransactionToUsersToGroupsId}/${groupId}`}
                        class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal w-[4.187rem] h-[2.063rem] bg-accent-blue rounded-2xl text-font-off-white text-base ml-3"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p class="text-font-grey text-lg">No outstanding expenses.</p>
        ))}
    </div>
  );
};
export default OwedGroup;
