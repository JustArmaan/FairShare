import { type TransactionSchema } from '../../../interface/types';

export const TransactionDetailsPage = ({
  transaction,
  callbackUrl,
}: {
  transaction: TransactionSchema;
  callbackUrl: string;
}) => {
  console.log(callbackUrl);
  return (
    <div class="p-6 animate-fade-in">
      <div class="flex justify-start w-fit items-center mb-1">
        <a
          hx-get={'/home/page'}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white text-4xl cursor-pointer"
          hx-push-url="true"
        >
          <img
            src="/icons/arrow_back_ios.svg"
            alt="back arrow icon"
            class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
          />
        </a>
      </div>
      <div class="flex justify-center flex-col items-center">
        <p class="text-3xl text-font-off-white font-semibold mb-1">
          ${transaction.amount}
        </p>
        <div class="text-font-grey text-md mb-3">
          1527 Main St, Vancouver, BC V6A 2W5
        </div>
        <div class="bg-primary-black rounded-lg shadow-lg px-4 py-2 w-full">
          <div class="text-font-off-white text-lg font-semibold">
            Status: <span class="text-green-600">Approved</span>
          </div>
          <div class="text-font-off-white mb-2">Scotiabank Interac debit</div>
          <div class="flex text-font-off-white justify-between bg-primary-black">
            <span class="text-lg font-semibold">Total</span>
            <span class="text-lg font-semibold">${transaction.amount}</span>
          </div>
        </div>
        <div class="mt-6 w-full h-auto rounded-lg bg-primary-black">
          <img
            src="/map/map-screenshot.png"
            class="rounded-t-lg w-full h-44 object-cover"
          />
          <p class="text-font-off-white py-3 px-4">
            {transaction.company} #{transaction.id}
          </p>
        </div>
        <div class="hover:-translate-y-0.5 font-semibold cursor-pointer transition-all rounded-lg w-full bg-primary-black text-accent-blue py-3 px-4 mt-6">
          Contact ScotiaBank
        </div>
        <p class="text-font-grey text-xs mt-2 leading-4">
          For help with a charge you don’t recognize or to dispute a charge,
          contact Scotiabank.
        </p>
      </div>
      <div class="h-20" />
    </div>
  );
};

export default TransactionDetailsPage;
