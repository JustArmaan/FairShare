import { type UserSchema } from "../../../../interface/types";
import type { getAllOwedForGroupTransaction } from "../../../../services/owed.service";
import type { ExtractFunctionReturnType } from "../../../../services/user.service";
import type { ArrayElement } from "../../transactions/components/Transaction";

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
  const combinedOwed = owedPerMember.reduce((total, owedPerMember) => {
    return [...total, ...owedPerMember];
  }, [] as { userId: string; amount: number }[]);
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

export const Members = ({
  memberDetails,
  currentUser,
  owedPerMember,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  owedPerMember: ExtractFunctionReturnType<
    typeof getAllOwedForGroupTransaction
  >[];
}) => {
  return (
    <div class="flex-col bg-primary-black w-full rounded-sm m-1">
      {calculateTotalOwedAll(owedPerMember, memberDetails).map((member) => {
        return (
          <div class="flex flex-row w-full">
            <div
              class={`flex-row rounded-full bg-${member.color} h-[2.5rem] w-[2.5rem] m-[1rem] justify-center`}
            >
              <span class="flex justify-center self-center text-center text-xl font-semibold mt-[0.4rem]">
                {member.firstName?.split("", 1) ?? ""}
                {member.lastName?.split("", 1) ?? ""}
              </span>
            </div>
            <div class="flex flex-col text-center self-center justify-center ml-4">
              <p class="text-font-off-white text-[0.875rem] font-medium">
                {member.firstName}
              </p>
              <p class="text-font-grey flex w-fit text-[0.625rem] font-normal">
                {
                  //@ts-ignore
                  member.type === "Owner" ? "Owner" : "Member"
                }
              </p>
            </div>
            <p class="flex-auto w-fit text-sm self-center mr-[2.81rem] justify-end ">
              {member.amount !== 0 && (
                <p class="flex text-font-off-white w-fit text-sm font-medium self-center justify-end">
                  {member.amount > 0 ? "You're Owed: " : "You Owe: "}{" "}
                  <span
                    class={`flex text-sm font-medium justify-end mr-[2.81rem] ${
                      member.amount > 0
                        ? "text-positive-number"
                        : "text-negative-number"
                    }`}
                  >
                    ${Math.abs(member.amount).toFixed(2)}
                  </span>
                </p>
              )}
            </p>

            {/* <div
              class={`flex rounded-full bg-${member.color} h-12 w-12 m-2 justify-center`}
            >
              <span class='flex justify-center self-center text-center text-xl font-semibold'>
                {member.firstName?.split('', 1) ?? ''}
                {member.lastName?.split('', 1) ?? ''}
              </span>
            </div>
            <div class='flex flex-col text-center self-center items-center justify-center ml-4 '>
              <p class='text-font-off-white flex w-fit'>{member.firstName}</p>

              {member.id === currentUser.id ? (
                <p class='text-font-off-white flex w-fit text-sm'>You</p>
              ) : (
                <p class='text-negative-number flex w-fit text-sm'>
                  {member.amount !== 0 && <span
                    class={`flex w-fit text-sm font-semibold ${
                      member.amount <= 0
                        ? 'text-positive-number'
                        : 'text-negative-number'
                    }`}
                  >
                    ${(-1 * member.amount).toFixed(2)}
                  </span>}
                </p>
              )}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default Members;
