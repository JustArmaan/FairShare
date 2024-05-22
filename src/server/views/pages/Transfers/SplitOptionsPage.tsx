import {
  type GroupTransactionWithSplitType,
  type GroupWithMembers,
} from '../../../services/group.service';
import { SplittingSelector } from './components/SplittingSelector';

export const SplitOptionsPage = ({
  groupId,
  transactionId,
  transaction,
  isOpen,
  groupWithMembers,
}: {
  groupId: string;
  transactionId: string;
  transaction: GroupTransactionWithSplitType;
  groupWithMembers: GroupWithMembers;
  isOpen: boolean;
}) => {
  function uppercaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function toggleSplitOptions(isCurrentlyOpen: boolean): boolean {
    return !isCurrentlyOpen;
  }

  const newIsOpenState = toggleSplitOptions(isOpen);
  return (
    <div class='p-6 animate-fade-in'>
      <div class='flex justify-start'>
        <a
          hx-get={`/groups/view/${groupId}`}
          hx-trigger='click'
          hx-target='#app'
          hx-swap='innerHTML'
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
        <div class='flex text-font-off-white text-left w-full'>
          <p class='semibold mr-2'>Total:</p>
          <p>${transaction.transaction.amount.toFixed(2)}</p>
        </div>
        <div class='flex text-font-off-white text-left w-full my-6'>
          <p class='semibold mr-2'>Company:</p>
          <p>{transaction.transaction.company}</p>
        </div>
        <div class='flex text-font-off-white w-full justify-between'>
          <div class='text-left flex'>
            <p class='semibold mr-2'>Date:</p>
            <p>{transaction.transaction.timestamp}</p>
          </div>
        </div>
        <div class='flex flex-row justify-center mt-6 text-font-off-white'>
          <button
            hx-get={`/transactions/details/${transactionId}`}
            hx-trigger='click'
            hx-swap='innerHTML'
            hx-target='#app'
            // rotate 0.0001deg prevents strange subpixel snapping during animation when viewport is 430px wide. I spent 15 mins on this.
            // https://stackoverflow.com/questions/24854640/strange-pixel-shifting-jumping-in-firefox-with-css-transitions
            class='hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform font-semibold px-12 py-2.5 bg-accent-blue rounded-xl w-2/3'
          >
            More Info
          </button>
        </div>
      </div>
      <div class='flex justify-start'>
        <h1 class='text-font-off-white text-2xl semibold mt-6'>
          Split Options
        </h1>
      </div>
      <div
        id='split-options'
        hx-get={`/transfer/splitTransaction/splitOptions/open/${transactionId}/${groupId}`}
        hx-trigger='click'
        hx-target='this'
        hx-swap='outerHTML'
        class='flex py-2 hover:opacity-80 pointer-cursor px-4 justify-between text-left text-font-off-white bg-primary-black rounded-lg mt-2 w-full'
      >
        <input
          id='select-split-options'
          type='button'
          name='select-split-options'
          value={uppercaseFirstLetter(transaction.type)}
        />
        <img src='/activeIcons/expand_more.svg' alt='expandable' />
      </div>
      <SplittingSelector transaction={transaction} groupWithMembers={groupWithMembers}/>
    </div>
  );
};

export default SplitOptionsPage;
