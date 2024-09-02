import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getGroupTransactionDetails } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export function formatDate(dateString: string) {
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

export const OwedGroup = (props: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions?: GroupWithTransactions;
  groupId: string;
  url?: string;
  owing?: boolean;
  resultPerGroupTransaction: ExtractFunctionReturnType<
    typeof getGroupTransactionDetails
  >[];
}) => {
  function maxCompanyNameLength(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  }

  // need to find out two cases:
  // owed, so positive number (subtract awaitingConfirmationAmounts!)
  // owing, so negative number (just the number on the tin)

  // filter results
  const filtered = props.resultPerGroupTransaction.filter(
    (groupStateResult) => {
      const ourTransaction = groupStateResult.find(
        (result) => result.users.id === props.currentUser.id
      );

      if (!ourTransaction) return false;

      return props.owing
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

        if (!props.owing) {
          acc.amount +=
            owed.users.id === props.currentUser.id
              ? owed.groupTransactionToUsersToGroups.amount
              : 0;
        }

        return acc;
      },
      {
        amount: props.owing
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

  const totalOwing = filtered.reduce(
    // just sums all amounts
    (acc, result) => {
      const relevantResults = result.filter(
        (
          result // sum our amounts if we owe, sum other amounts if we're owed
        ) =>
          props.owing
            ? result.users.id === props.currentUser.id
            : result.users.id === props.currentUser.id &&
              result.groupTransactionToUsersToGroupsStatus.status === "notSent"
      );

      return (
        acc +
        relevantResults.reduce(
          (acc, result) => acc + result.groupTransactionToUsersToGroups.amount,
          0
        )
      );
    },
    0
  );

  return (
    <>
      {filtered.length > 0 && (
        <div class="bg-[#232222] rounded-lg mt-4 animate-fade-in">
          <p class="text-font-off-white text-xl font-medium pt-3 text-center">
            {props.owing ? "Owing" : "Owed"}
          </p>
          {totalOwing !== 0 ? (
            <p class="text-font-off-white font-medium text-sm text-center">
              {totalOwing > 0 ? "You are owed " : "You owe "}
              <span
                class={`text-font-off-white font-medium text-sm text-center ${
                  totalOwing && totalOwing > 0
                    ? "text-positive-number"
                    : "text-negative-number"
                }`}
              >
                ${Math.abs(totalOwing).toFixed(2)}
              </span>{" "}
              overall
            </p>
          ) : (
            <p class="text-font-off-white font-medium text-sm text-center">
              Your bills are even.
            </p>
          )}
          <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center">
            {processedData.map((result) => (
              <div class="w-full bg-primary-black relative mb-3 rounded-md py-[0.75rem] px-[0.69rem] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                    {maxCompanyNameLength(result.company ?? "", 20)}
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
                  {formatDate(result.timestamp!)}
                </p>
                <div class="flex justify-between w-full">
                  <p class="text-font-off-white self-start mt-[1.25rem] text-[0.875rem]">
                    Paid by:{" "}
                    <span class="text-font-off-white self-start font-semibold">
                      {result.user.id === props.currentUser.id
                        ? "You"
                        : result.user.firstName}
                    </span>
                  </p>
                  <div class="flex flex-row justify-center text-font-off-white mt-[0.5rem]">
                    <button
                      hx-swap="innerHTML"
                      hx-get={`/split/view?owedId=${result.groupTransactionToUsersToGroupsId}&groupId=${props.groupId}`}
                      hx-target="#app"
                      hx-push-url={`/split/view?owedId=${result.groupTransactionToUsersToGroupsId}&groupId=${props.groupId}`}
                      class="w-[5.4rem] flex items-center justify-center hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal border-accent-blue border-[2px] rounded-[1.25rem] text-font-off-white text-base"
                    >
                      <p>View</p>
                    </button>
                    <button
                      hx-swap={props.owing ? "innerHTML" : "none"}
                      {...(props.owing
                        ? {
                            "hx-get": `/split/settle?owedId=${result.groupTransactionToUsersToGroupsId}&groupId=${props.groupId}`,
                          }
                        : {
                            "hx-get": `/notification/remind?owedId=${result.groupTransactionToUsersToGroupsId}`,
                          })}
                      hx-target="#app"
                      hx-push-url={``}
                      class="w-[5.4rem] flex items-center justify-center hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-normal bg-accent-blue rounded-[1.25rem] text-font-off-white text-base ml-3"
                    >
                      <p class="h-fit">{props.owing ? "Settle" : "Remind"}</p>
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
