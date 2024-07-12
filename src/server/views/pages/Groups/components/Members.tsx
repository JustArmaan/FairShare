import {
  type UserSchema,
  type UserSchemaWithMemberType,
} from "../../../../interface/types";
import type { getAllOwedForGroupTransaction } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { ArrayElement } from "../../transactions/components/Transaction";
import type { Member } from "./ViewGroup";

function calculateTotalOwed(
  accumulator: { userId: string; amount: number }[],
  currentOwed: ArrayElement<
    ExtractFunctionReturnType<typeof getAllOwedForGroupTransaction>
  >
) {
  const accIndex = accumulator.findIndex(
    (item) => currentOwed.userId === item.userId
  );
  if (accIndex === -1) {
    accumulator.push({
      userId: currentOwed.userId,
      amount: currentOwed.amount,
    });
  } else {
    accumulator[accIndex].amount += currentOwed.amount;
  }
  return accumulator;
}

function calculateTotalOwedAll(
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransaction
  >[],
  members: UserSchema[]
) {
  const combinedOwed = owedPerMember.reduce(
    (total, owedPerMember) => {
      return [...total, ...owedPerMember];
    },
    [] as { userId: string; amount: number }[]
  );
  const noOwedMembers = members.filter(
    (member) => !combinedOwed.some((owed) => owed.userId === member.id)
  );
  return [
    ...combinedOwed
      .reduce(calculateTotalOwed, [] as { userId: string; amount: number }[])
      .map((totalOwed) => {
        const member = members.find((member) => member.id === totalOwed.userId);

        return {
          ...member,
          amount: totalOwed.amount,
        };
      }),
    ...noOwedMembers.map((member) => ({
      ...member,
      amount: 0,
    })),
  ];
}

export const Members = (props: {
  memberDetails: UserSchemaWithMemberType[];
  currentUser: UserSchema;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransaction
  >[];
}) => {
  console.log(props.memberDetails);
  const totalOwed = calculateTotalOwedAll(
    props.owedPerMember,
    props.memberDetails
  );
  return (
    <div class="flex-col bg-primary-black w-full rounded-sm py-[0.88rem]">
      {totalOwed.map((member, index) => {
        if (member.id !== props.currentUser.id) {
          member.amount = member.amount * -1;
        }
        return (
          <div
            class={`flex flex-row justify-between w-full pl-[0.94rem] py-[0.5rem] ${1 !== totalOwed.length && index !== totalOwed.length - 1 ? "mb-[1rem]" : ""}`}
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
                  class={`flex w-fit text-sm font-medium self-center justify-end h-fit ${member.amount === 0 ? "text-font-grey" : "text-font-off-white"}`}
                >
                  {member.id !== props.currentUser.id &&
                    (member.amount === 0
                      ? "Settled"
                      : member.amount > 0
                        ? "You're Owed:"
                        : "You Owe:")}
                  <span
                    class={`flex text-sm font-medium justify-end min-[360px]:mr-[2.81rem] mr-[0.94rem] ml-[0.25rem] ${
                      member.amount > 0
                        ? "text-positive-number"
                        : "text-negative-number"
                    }`}
                  >
                    {member.id !== props.currentUser.id &&
                      "$" + Math.abs(member.amount).toFixed(2)}
                  </span>
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
