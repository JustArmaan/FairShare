import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";
import type {
  getAllOwedForGroupTransaction,
  getGroupTransactionDetails,
} from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";

export const Members = (props: {
  memberDetails: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  resultPerGroupTransaction: ExtractFunctionReturnType<
    typeof getGroupTransactionDetails
  >[];
}) => {
  /*
  const totalOwed = calculateTotalOwedAll(
    props.owedPerMember,
    props.memberDetails
  );*/

  // need to figure out how much is owed relative to us
  // figure out if we're owing or owed for a transaction and add it to the sum

  // map into relative to current user, then reduce over member list

  const memberObject = props.memberDetails
    .filter((member) => member.type !== "Invited")
    .map((member) => ({
      member,
      owed: 0,
    }));

  const owedRelativeToCurrentUser = props.resultPerGroupTransaction.reduce(
    (acc, resultPerGroupTransaction) => {
      const ourTransaction = resultPerGroupTransaction.find(
        (result) => result.users.id === props.currentUser.id
      );

      if (
        !ourTransaction ||
        ourTransaction.groupTransactionToUsersToGroups.amount === 0
      ) {
        return acc;
      }

      if (ourTransaction!.groupTransactionToUsersToGroups.amount > 0) {
        const filtered = resultPerGroupTransaction.filter(
          (result) => result.users.id !== props.currentUser.id
        );

        filtered.forEach((result) => {
          const amountOwed = result.groupTransactionToUsersToGroups.amount;
          acc.find((entry) => entry.member.id === result.users.id)!.owed +=
            amountOwed;
        });
      } else {
        const transactionOwner = resultPerGroupTransaction.find(
          (result) => result.groupTransactionToUsersToGroups.amount > 0
        )!;
        acc.find(
          (entry) => entry.member.id === transactionOwner.users.id
        )!.owed -= ourTransaction.groupTransactionToUsersToGroups.amount;
      }

      return acc;
    },
    memberObject as { member: UserSchemaWithMemberType; owed: number }[]
  );

  return (
    <div
      class="flex-col bg-primary-black w-full rounded-sm py-[0.88rem]"
      id="ws-group-members"
    >
      {owedRelativeToCurrentUser.map(({ member, owed }, index) => {
        owed *= -1;
        return (
          <div
            class={`flex flex-row justify-between w-full pl-[0.94rem] py-[0.5rem] ${
              1 !== owedRelativeToCurrentUser.length &&
              index !== owedRelativeToCurrentUser.length - 1
                ? "mb-[1rem]"
                : ""
            }`}
          >
            <div
              class={`flex flex-row rounded-full bg-${member.color} h-[2rem] w-[2rem] mr-[0.87rem] justify-center items-center`}
            >
              <span class="flex justify-center self-center text-center text-sm font-semibold">
                {member.firstName?.split("", 1) ?? ""}
                {member.lastName?.split("", 1) ?? ""}
              </span>
            </div>
            <div class="flex flex-col self-center">
              <div class="flex flex-row items-center h-[1rem]">
                <p class="text-font-off-white text-[0.875rem] font-medium">
                  {member.firstName}
                </p>
                {member.id === props.currentUser.id && (
                  <div class="flex flex-row h-[0.8125rem] w-[2.125rem] bg-accent-purple rounded-[0.250rem] self-center justify-center items-center ml-[0.31rem]">
                    <p class="font-normal text-font-off-white text-[0.625rem] text-center">
                      You
                    </p>
                  </div>
                )}
              </div>
              <p class="text-font-grey flex w-fit text-[0.625rem] font-normal h-[0.75rem]">
                {
                  //@ts-ignore
                  member.type === "Owner" ? "Owner" : "Member"
                }
              </p>
            </div>
            <p class="flex flex-auto w-fit text-sm self-center justify-end h-[1rem]">
              {
                <p
                  class={`flex w-fit text-sm font-medium self-center justify-end h-fit 
                          min-[360px]:mr-[2.81rem] mr-[0.94rem]
                  ${owed === 0 ? "text-font-grey" : "text-font-off-white"}`}
                >
                  {member.id !== props.currentUser.id &&
                    (owed === 0
                      ? "Settled"
                      : owed > 0
                        ? "You're Owed:"
                        : "You Owe:")}
                  {Math.abs(owed) !== 0 && (
                    <span
                      class={`flex text-sm font-medium justify-end  ml-[0.25rem] ${
                        owed > 0
                          ? "text-positive-number"
                          : "text-negative-number"
                      }`}
                    >
                      {member.id !== props.currentUser.id &&
                        "$" + Math.abs(owed).toFixed(2)}
                    </span>
                  )}
                </p>
              }
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
