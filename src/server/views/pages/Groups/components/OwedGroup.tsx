import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getAllOwedForGroupTransactionWithTransactionId } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const OwedGroup = (props: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions?: GroupWithTransactions;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransactionWithTransactionId
  >[];
  groupId: string;
  url?: string;
  owing?: boolean;
}) => {
  function maxCompanyNameLength(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  }
  const owedForThisMember = props.owedPerMember
    .map(
      (owedList) =>
        owedList.find((owed) => owed.userId === props.currentUser.id)!
    )
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
  const processedData =
    props.transactions &&
    props.transactions.length > 0 &&
    owedForThisMember.length > 0 &&
    owedForThisMember.map((owedList) => ({
      ...owedList,
      transaction: props.transactions?.find(
        (transaction) => transaction.id === owedList.transactionId
      )!,
    }));

  const totalOwing = processedData
    ? processedData
        .filter((result) =>
          props.owing ? result.amount > 0 : result.amount < 0
        )
        .reduce((acc, result) => acc + result.amount, 0)
    : 0;

  return (
    <>
      {processedData && (
        <div class="bg-[#232222] rounded-lg mt-4">
          <p class="text-font-off-white text-xl font-medium pt-3 text-center">
            {totalOwing ? "Owed" : "Owing"}
          </p>
          <p class="text-font-off-white font-medium text-sm text-center">
            {totalOwing > 0 ? "You are owed " : "You owe "}
            <span
              class={`text-font-off-white font-medium text-sm text-center ${
                totalOwing && totalOwing > 0
                  ? "text-positive-number"
                  : "text-negative-number"
              }`}
            >
              ${Math.abs(totalOwing)}
            </span>{" "}
            overall
          </p>
          <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center">
            {processedData.map((result) => (
              <div class="w-full bg-primary-black relative mb-3 rounded-md py-[0.75rem] px-[0.69rem] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                    {maxCompanyNameLength(result.transaction.company ?? "", 20)}
                  </p>
                  <p class="text-font-off-white self-end w-fit">
                    {result.amount > 0 ? "You're Owed " : "You Owe "}
                    <span
                      class={`font-medium ${
                        result.amount > 0
                          ? "text-positive-number"
                          : "text-negative-number"
                      }`}
                    >
                      ${Math.abs(result.amount).toFixed(2)}
                    </span>
                  </p>
                </div>
                <p class="text-font-off-white self-start text-xs -mt-1.5">
                  {formatDate(result.transaction.timestamp!)}
                </p>
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start mt-[1.25rem] text-[0.875rem]">
                    Paid by:{" "}
                    <span class="text-font-off-white self-start font-semibold">
                      {props.currentUser.firstName}
                      {/* This needs to be whoever paid for the bill originally */}
                    </span>
                  </p>
                  <div class="flex flex-row justify-center text-font-off-white mt-[0.5rem]">
                    <button
                      hx-swap="innerHTML"
                      hx-get={`/transactions/details/${result.transactionId}/?url=${props.url}`}
                      hx-push-url={`/transactions/details/${result.transactionId}/?url=${props.url}`}
                      hx-target="#app"
                      class="flex items-center justify-center py-[.6875rem] px-[0.5rem] hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal w-[4.187rem] h-[2.063rem] border-accent-blue border-[2px] rounded-[1.25rem] text-font-off-white text-base"
                    >
                      <p>View</p>
                    </button>

                    <button
                      hx-swap="innerHTML"
                      hx-get={`/groups/pay/${result.groupTransactionToUsersToGroupsId}/${props.groupId}`}
                      hx-target="#app"
                      hx-push-url={`/groups/pay/${result.groupTransactionToUsersToGroupsId}/${props.groupId}`}
                      class="flex items-center justify-center py-[.6875rem] px-[0.5rem] hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal w-[4.187rem] h-[2.063rem] bg-accent-blue rounded-[1.25rem] text-font-off-white text-base ml-3"
                    >
                      <p class="h-fit">Settle</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default OwedGroup;
