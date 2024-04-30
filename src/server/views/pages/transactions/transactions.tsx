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
    <Html>
      <Card />
      <div>
        <h3>All Transactions</h3>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} />
        ))}
      </div>
    </Html>
  );
};

export default TransactionsPage;
