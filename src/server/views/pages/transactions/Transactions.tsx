import { Transaction } from './components/Transaction';
import { type Transactions } from '../../../routes/indexRouter';
import { Card } from './components/Card';

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
  transactions: Transactions;
  cardDetails: CardDetails;
}

export const TransactionsPage = ({
  transactions,
  cardDetails,
}: TransactionsPageProps) => {
  return (
    <div class="p-6">
      <div class="mb-2 flex justify-start w-fit items-center">
        <a
          hx-get="/home"
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="text-font-off-white mr-3 text-xl"
        >
          Card
        </a>
        <img class="h-3" src="images/right-triangle.svg" alt="triangle icon" />
      </div>
      <Card cardDetails={cardDetails} />
      <div class="h-px bg-primary-dark-grey mb-2" />
      <p class="text-xl text-font-off-white font-medium">Transaction History</p>
      <div class="mt-2">
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
      <div class="h-20"></div>
    </div>
  );
};

export default TransactionsPage;
