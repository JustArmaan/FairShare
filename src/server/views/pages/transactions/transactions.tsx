import { Html } from "../../components/Html";
import { transactions } from "../../../database/schema/transaction";
import { Transaction } from "./components/transaction";


type TransactionsProps = {
  transactions: Array<{
    id: number;
    type: string;
    amount: number;
  }>;
};

export const TransactionsPage = ({ transactions }: TransactionsProps) => {
  return (
    <div>
      <h3>All Transactions</h3>
      {transactions.map((transaction) => (
        <Transaction transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionsPage;