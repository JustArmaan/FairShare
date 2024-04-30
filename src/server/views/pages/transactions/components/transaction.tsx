type TransactionProps = {
  transaction: {
    id: number;
    type: string;
    amount: number;
  };
};

export const Transaction = ({ transaction }: TransactionProps) => {
  return (
    <div>
      <h4>Transaction ID: {transaction.id}</h4>
      <p>Type: {transaction.type}</p>
      <p>Amount: ${transaction.amount}</p>
    </div>
  );
};

export default Transaction;
