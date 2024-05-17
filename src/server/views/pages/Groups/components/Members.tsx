import { type UserSchema } from '../../../../interface/types';
import type { getAllOwedForGroupTransaction } from '../../../../services/owed.service';
import type { ExtractFunctionReturnType } from '../../../../services/user.service';
import type { ArrayElement } from '../../transactions/components/Transaction';

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
  return owedPerMember
    .reduce(
      (total, owedPerMember) => {
        return [...total, ...owedPerMember];
      },
      [] as { userId: string; amount: number }[]
    )
    .reduce(calculateTotalOwed, [] as { userId: string; amount: number }[])
    .map((totalOwed) => {
      const member = members.find((member) => member.id === totalOwed.userId)!;
      return {
        ...member,
        amount: totalOwed.amount,
      };
    });
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
    <div class="flex flex-wrap items-center w-full">
      {calculateTotalOwedAll(owedPerMember, memberDetails).map((member) => (
        <div class="flex bg-primary-black h-16 md:w-[calc(100%_-_0.5rem)] w-[calc(50%_-_0.5rem)] rounded-lg m-1 items-center">
          <div
            class={`flex rounded-full bg-${member.color} h-12 w-12 m-2 justify-center`}
          >
            <span class="flex justify-center self-center text-center text-xl font-semibold">
              {member.firstName.split('', 1)}
              {member.lastName.split('', 1)}
            </span>
          </div>
          <div class="flex flex-col text-center self-center items-center justify-center ml-4 ">
            <p class="text-font-off-white flex w-fit">{member.firstName}</p>

            {member.id === currentUser.id ? (
              <p class="text-font-off-white flex w-fit text-sm">You</p>
            ) : (
              <p class="text-negative-number flex w-fit text-sm">
                <span
                  class={`flex w-fit text-sm font-semibold ${
                    member.amount <= 0
                      ? 'text-positive-number'
                      : 'text-negative-number'
                  }`}
                >
                  ${(-1 * member.amount).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Members;
