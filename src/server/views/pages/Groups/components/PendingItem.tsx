import { type UserSchema } from '../../../../interface/types';
import { type GroupWithTransactions } from '../../../../services/group.service';
import type { getAllOwedForGroupTransactionWithTransactionId } from '../../../../services/owed.service';
import type { ExtractFunctionReturnType } from '../../../../services/user.service';

export const PendingItems = ({
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
    return str.length > max ? str.substring(0, max - 3) + '...' : str;
  }

  function firstLetterUppercase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-4 mt-3 flex items-center bg-primary-black relative">
      {transactions &&
        (transactions.length > 0 &&
        owedPerMember
          .map(
            (owedList) =>
              owedList.find((owed) => owed.userId === currentUser.id)!
          )
          .filter((owed) => owed.pending).length > 0 ? (
          owedPerMember
            .map(
              (owedList) =>
                owedList.find((owed) => owed.userId === currentUser.id)!
            )
            .filter((owed) => owed.pending)
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
                    {maxCompanyNameLength(result.transaction.company ?? '', 20)}
                  </p>
                  <p class="text-font-off-white self-end w-fit text-lg">
                    Split:{' '}
                    <span class="text-lg font-medium">
                      {firstLetterUppercase(result.transaction.type)}
                    </span>
                  </p>
                </div>
                <p class="text-font-off-white self-start text-xs">
                  {result.transaction.timestamp}
                </p>
                <p class="text-font-off-white self-start mt-2 mb-2">
                  Total:{' '}
                  <span class="text-font-off-white self-start mt-2 font-semibold">
                    ${transactions.map((list) => list.amount.toFixed(2))}
                    {/* This needs to be whoever paid for the bill */}
                  </span>
                </p>
                <div class="flex justify-evenly w-full">
                  <button
                    hx-swap="innerHTML"
                    hx-get={`/transfer/splitTransaction/${groupId}/${result.transactionId}`}
                    hx-target="#app"
                    class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold py-1.5 w-1/2 border-4 border-accent-blue text-font-off-white rounded-xl h-fit"
                  >
                    Edit
                  </button>
                  <div class="w-2"></div>

                  <button
                    hx-swap="innerHTML"
                    hx-get={`/groups/confirm-transaction/?owedId=${result.groupTransactionToUsersToGroupsId}`}
                    hx-target="#app"
                    class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold py-2.5 w-1/2 bg-accent-blue rounded-xl h-fit text-font-off-white"
                  >
                    Confirm
                  </button>
                </div>
                {index !== transactions.length - 1 && (
                  <div class="mt-4 h-[1px] bg-primary-grey rounded w-full"></div>
                )}
              </div>
            ))
        ) : (
          <p class="text-font-grey text-lg">No pending expenses.</p>
        ))}
    </div>
  );
};
export default PendingItems;
