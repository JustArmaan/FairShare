import { Html } from "../../components/Html";
import { Transaction } from "./components/transaction";
import { Card } from "./components/card";

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

interface TransactionsData {
  transactions: Transaction[];
}

export const TransactionsPage = ({ transactions }: TransactionsData) => {
  return (
    <div class="p-6">
      <Card />
      <p class="text-xl text-font-off-white font-bold">Transaction History</p>
      <div class="mt-6">
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionsPage;
