import { Transaction } from './components/transaction';
import { Card } from './components/card';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  company: string;
  amount: number;
  timestamp: string;
  category: Category;
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

interface TransactionsPageProps {
  transactions: Transaction[];
  cardDetails: CardDetails;
}

export const TransactionsPage = ({
  transactions,
  cardDetails,
}: TransactionsPageProps) => {
  return (
    <>
      <a
        hx-get="/home"
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        class="text-font-off-white w-60 bg-accent-blue"
      >
        Click me
      </a>
      <Card cardDetails={cardDetails} />
      <p class="text-xl text-font-off-white font-bold">Transaction History</p>
      <div class="mt-6">
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
    </>
  );
};

export default TransactionsPage;
