import { type UserSchema } from '../../../../interface/types';
import { type GroupWithTransactions } from '../../../../services/group.service';

export const OwedGroup = ({
  memberDetails,
  currentUser,
  transactions,
}: {
  memberDetails: UserSchema[];
  currentUser: UserSchema;
  transactions: GroupWithTransactions;
}) => {
  function maxCompanyNameLength(str: string, max: number) {
    return str.length > max ? str.substring(0, max - 3) + '...' : str;
  }
  return (
    <div class="flex-col w-full justify-evenly rounded-lg py-1.5 px-1 mt-3 flex items-center bg-primary-black relative">
      {transactions.map((transaction, index) => (
        <>
          <div class="my-2">
            <div class="flex justify-between w-full">
              <p class="text-font-off-white self-start w-fit font-semibold text-lg">
                {maxCompanyNameLength(transaction.company ?? '', 20)}
              </p>
              <p class="text-font-off-white self-end w-fit text-lg">
                You Owe:{' '}
                <span class=" text-lg font-medium text-negative-number">
                  ${transaction.amount / memberDetails.length}
                </span>
              </p>
            </div>
            <p class="text-font-off-white self-start text-xs">
              {transaction.timestamp}
            </p>
            <div class="flex justify-between w-full">
              <p class="text-font-off-white self-start mt-2">
                Paid by:{' '}
                <span class="text-font-off-white self-start mt-2 font-semibold">
                  {' '}
                  {}
                </span>
              </p>
              <div class="flex flex-row justify-center text-font-off-white">
                <button
                  hx-swap="innerHTML"
                  hx-get="/breakdown/page"
                  hx-target="#app"
                  // rotate 0.0001deg prevents strange subpixel snapping during animation when viewport is 430px wide. I spent 15 mins on this.
                  // https://stackoverflow.com/questions/24854640/strange-pixel-shifting-jumping-in-firefox-with-css-transitions
                  class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl"
                >
                  View and Pay
                </button>
              </div>
            </div>
            <div class="mx-3 mt-4 h-[1px] bg-primary-grey rounded w-full"></div>
            {index === transactions.length - 1 && <div class="pb-2"></div>}
          </div>
        </>
      ))}
    </div>
  );
};
export default OwedGroup;
