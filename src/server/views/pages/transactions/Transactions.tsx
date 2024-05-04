import { Transaction } from './components/Transaction';
import { type TransactionSchema } from '../../../interface/types';
import { Card } from './components/Card';

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
];

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

interface TransactionsPageProps {
  transactions: TransactionSchema[];
  cardDetails: CardDetails;
}

export const TransactionsPage = ({
  transactions,
  cardDetails,
}: TransactionsPageProps) => {
  return (
    <div class="p-6 animate-fade-in">
      <a
        hx-get="/home/page"
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        class="mb-2 flex justify-start w-fit items-center hover:-translate-y-0.5 transition-transform cursor-pointer"
        hx-push-url="true"
      >
        <p class="text-font-off-white mr-3 text-xl">Card</p>
        <img class="h-3" src="/images/right-triangle.svg" alt="triangle icon" />
      </a>
      <Card cardDetails={cardDetails} />
      <div class="h-px bg-primary-dark-grey mb-2" />
      <p class="text-xl text-font-off-white font-medium">Transaction History</p>
      <div class="mt-2">
        {transactions.map((transaction, categoryIndex) => (
          <Transaction
            transaction={transaction}
            tailwindColorClass={iconColors[categoryIndex % iconColors.length]}
          />
        ))}
      </div>
      <div class="h-20"></div>
    </div>
  );
};

export default TransactionsPage;
