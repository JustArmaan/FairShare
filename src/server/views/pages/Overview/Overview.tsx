import { Transaction } from '../transactions/components/Transaction';
import { type Transactions } from '../../../routes/indexRouter';

interface UserDetails {
  userName: string;
  totalAmount: string;
  cardsAmount: string[]
}

interface CardDetails {
  primaryColor: string;
  textColor: string;
  accentColor1: string;
  accentColor2: string;
  bankLogo: string;
  bankName: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
}

interface CardProps {
  cardDetails: CardDetails;
}


export const Overview = ({ transactions, userDetails, cardDetails }: { transactions: Transactions, userDetails: UserDetails, cardDetails: CardDetails }) => {
  return (
    <div class="p-6">
      {' '}
      <h1 class="text-2xl text-font-off-white pt-2"> Welcome, {userDetails.userName}</h1>{' '}
      <div class="rounded-lg pl-4 mt-3 py-2 flex justify-between items-center bg-primary-black relative">
        <div>
          <p class="text-base text-font-off-white">Overview</p>
          <p class="text-2xl text-font-off-white">${userDetails.totalAmount}</p>
          <p class="text-xs text-font-off-white">Contributions</p>
        </div>
        <span class="absolute top-3 right-3">
          <img
            src="/images/InfoIcon.svg"
            alt="Informational Icon"
            class="w-3.5 h-3.5"
          ></img>
        </span>
      </div>
      <p class="flex items-center text-xl text-font-off-white mt-2">
        My Accounts{' '}
        <img
          src="/images/addcircle.svg"
          alt="Add Icon"
          class="mt-2.5 h-8"
        ></img>
      </p>
      <div class="rounded-lg bg-primary-black ">
        <div class="ml-4 mt-3 py-2 flex justify-between items-center">
          <p class="text-base text-font-off-white">
            Bank<span class="text-sm text-font-off-white">({cardDetails.cardNumber.slice(0, 4)})</span>
          </p>
        </div>
        <div class="flex justify-center">
          <p class="text-base text-font-off-white">${userDetails.cardsAmount[1]}</p>
        </div>
        <hr class="mx-3 h-0.5 bg-font-off-white"></hr>
        <p class="ml-4 mt-2 text-base text-font-off-white">Monthly Breakdown</p>
      </div>
      <div>
        <div class="flex flex-row justify-between text-center items-center mb-0 mt-3">
          <p class="text-xl text-font-off-white">Transaction History</p>
          <a
            hx-get="/transactions"
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            class="text-font-off-white cursor-pointer hover:opacity-90"
          >
            View All
          </a>
        </div>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
      <div class="h-20"></div>
    </div>
  );
};
