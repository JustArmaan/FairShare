import {
  type GroupTransactionWithSplitType,
  type GroupWithMembers,
} from '../../../services/group.service';
import { type OwedTransactionWithMember } from '../../../services/owed.service';
import { FullSelector } from './components/FullSelector';

export const SplitOptionsPage = ({
  groupId,
  transactionId,
  transaction,
  groupWithMembers,
  owedInfo,
  splitType,
}: {
  groupId: string;
  transactionId: string;
  transaction: GroupTransactionWithSplitType;
  groupWithMembers: GroupWithMembers;
  owedInfo: OwedTransactionWithMember;
  splitType?: string;
}) => {
  return (
    <div class='p-6 animate-fade-in'>
      <div class='flex justify-start'>
        <a
          hx-get={`/groups/view/${groupId}`}
          hx-trigger='click'
          hx-target='#app'
          hx-swap='innerHTML'
          hx-push-url={`/groups/view/${groupId}`}
          class='text-font-off-white text-4xl cursor-pointer w-fit'
        >
          <img
            src='/icons/arrow_back_ios.svg'
            alt='back arrow icon'
            class='hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6'
          />
        </a>
      </div>
      <div class='flex justify-start'>
        <h1 class='text-font-off-white text-2xl semibold mt-6'>
          Transaction Details
        </h1>
      </div>
      <div class='flex flex-col justify-center mt-6 bg-primary-black w-full h-fit rounded-lg py-4 px-6'>
        <div class='flex text-font-off-white text-left w-full mb-2'>
          <p class='semibold mr-2'>Total:</p>
          <p>${transaction.transaction.amount.toFixed(2)}</p>
        </div>
        <div class='flex text-font-off-white text-left w-full my-6'>
          <p class='semibold mr-2'>Company:</p>
          <p>{transaction.transaction.company}</p>
        </div>
        <div class='flex items-center justify-between w-full text-font-off-white'>
          <div class='text-left flex items-center'>
            <p class='semibold mr-2'>Date:</p>
            <p>{transaction.transaction.timestamp}</p>
          </div>
          <div class='flex flex-row justify-center items-center'>
            <button
              hx-get={`/transactions/details/${transactionId}`}
              hx-trigger='click'
              hx-swap='innerHTML'
              hx-target='#app'
              hx-push-url={`/transactions/details/${transactionId}`}
              class='hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-2.5 py-2.5 bg-accent-blue rounded-xl'
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      <div class='flex justify-start'>
        <h1 class='text-font-off-white text-2xl semibold mt-6'>
          Split Options
        </h1>
      </div>
      <form class='w-full h-fit flex flex-col justify-center'>
        <div id='swap-full-selector'>
          <FullSelector
            transactionId={transactionId}
            groupId={groupId}
            transaction={transaction}
            groupWithMembers={groupWithMembers}
            owedInfo={owedInfo}
            splitType={splitType ? splitType : transaction.type}
          />
        </div>
        <div class='w-full flex justify-center'>
          <input
            hx-post={`/transfer/splitOptions/edit`}
            hx-trigger='click'
            hx-target='#app'
            hx-swap='innerHTML'
            type='button'
            value='Save Changes'
            class='flex justify-center text-font-off-white mt-4 hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl w-2/3'
          />
        </div>
      </form>
    </div>
  );
};

export default SplitOptionsPage;
