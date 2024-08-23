import type { OwedStatus } from "../../../../database/seed";
import { type UserSchema } from "../../../../interface/types";
import { type GroupWithTransactions } from "../../../../services/group.service";
import type { getGroupTransactionDetails } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export function maxCompanyNameLength(str: string, max: number) {
  return str.length > max ? str.substring(0, max - 3) + "..." : str;
}

export const PendingItems = (props: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions?: GroupWithTransactions;
  groupId: string;
  resultPerGroupTransaction: ExtractFunctionReturnType<
    typeof getGroupTransactionDetails
  >[];
}) => {
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

  // grab results, if result user amount is positive, loop through and show all
  // owed amounts pending confirmation
  //

  const owedToCurrentUserTransactions = props.resultPerGroupTransaction.reduce(
    (acc, groupStateResult) => {
      const ourTransaction = groupStateResult.find(
        (result) => result.users.id === props.currentUser.id
      )!;

      if (ourTransaction.groupTransactionToUsersToGroups.amount === 0) {
        return acc;
      }
      if (ourTransaction.groupTransactionToUsersToGroups.amount > 0) {
        groupStateResult.forEach((result) => {
          if (result.users.id === props.currentUser.id) return;
          if (
            (result.groupTransactionToUsersToGroupsStatus
              .status as OwedStatus[number]) === "awaitingConfirmation"
          ) {
            acc.push(result);
          }
        });
      }

      if (
        (ourTransaction.groupTransactionToUsersToGroupsStatus
          .status as OwedStatus[number]) === "awaitingConfirmation"
      ) {
        (
          ourTransaction as unknown as typeof props.resultPerGroupTransaction & {
            originalOwner?: UserSchema;
          }
        ).originalOwner = groupStateResult.find(
          (result) => result.groupTransactionToUsersToGroups.amount > 0
        )!.users;
        console.log(ourTransaction);
        acc.push(ourTransaction); // we owe and have transferred
      }

      return acc;
    },
    [] as (typeof props.resultPerGroupTransaction & {
      originalOwner?: UserSchema;
    })[number]
  );

  return (
    <>
      {owedToCurrentUserTransactions.length > 0 && (
        <div class="bg-[#232222] rounded-lg">
          <p class="text-font-off-white text-xl font-medium pt-3 text-center">
            Pending Transfers
          </p>
          <div class="flex-col w-full justify-center rounded-lg py-1.5 px-4 mt-3 flex items-center">
            {owedToCurrentUserTransactions.map((result) => (
              <div class="w-full bg-primary-black relative rounded-md shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
                <div class="p-3">
                  <div class="flex flex-row justify-between w-full">
                    <div class="flex flex-col justify-start w-fit">
                      <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                        {maxCompanyNameLength(
                          result.transactions.company ?? "",
                          20
                        )}
                      </p>
                      <p class="text-font-off-white self-start text-xs -mt-1">
                        {formatDate(result.transactions.timestamp!)}
                      </p>
                    </div>
                    <p class="text-font-off-white text-right font-medium relative top-0.5">
                      {result.users.id !== props.currentUser.id ? (
                        <>
                          <span>
                            {maxCompanyNameLength(result.users.firstName, 20)}{" "}
                            has sent you:
                          </span>{" "}
                          <span class="text-positive-number font-semibold">
                            $
                            {Math.abs(
                              result.groupTransactionToUsersToGroups.amount
                            ).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            You sent{" "}
                            {
                              //@ts-ignore
                              result.originalOwner.firstName
                            }
                            :
                          </span>
                          <span class="text-negative-number font-semibold">
                            {" "}
                            $
                            {Math.abs(
                              result.groupTransactionToUsersToGroups.amount
                            ).toFixed(2)}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div
                    class={`flex justify-between w-full mt-2 text-font-off-white items-center`}
                  >
                    <p>
                      Paid by:{" "}
                      {result.users.id === props.currentUser.id
                        ? // @ts-ignore
                          result.originalOwner.firstName
                        : "You"}
                    </p>
                    {result.users.id !== props.currentUser.id ? (
                      <div>
                        <button
                          hx-swap="innerHTML"
                          hx-get={`/split/view?owedId=${result.groupTransactionToUsersToGroups.id}&groupId=${props.groupId}`}
                          hx-target="#app"
                          hx-push-url={`/split/view?owedId=${result.groupTransactionToUsersToGroups.id}&groupId=${props.groupId}`}
                          class="mr-2.5 hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform py-[0.20rem] px-6 border-[2px] border-accent-blue rounded-lg h-fit text-font-off-white"
                        >
                          View
                        </button>
                        <button
                          hx-post="/split/confirm"
                          hx-vals={`{
                          "owedId": "${result.groupTransactionToUsersToGroups.id}"
                          }`}
                          hx-trigger="click"
                          class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform py-[0.20rem] px-6 bg-accent-blue rounded-lg h-fit text-font-off-white"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        hx-swap="innerHTML"
                        hx-get={`/split/view?owedId=${result.groupTransactionToUsersToGroups.id}&groupId=${props.groupId}`}
                        hx-target="#app"
                        hx-push-url={`/split/view?owedId=${result.groupTransactionToUsersToGroups.id}&groupId=${props.groupId}`}
                        class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform py-[0.20rem] px-6 border-[2px] border-accent-blue rounded-lg h-fit text-font-off-white"
                      >
                        View
                      </button>
                    )}
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
export default PendingItems;
