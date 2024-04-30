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
  transaction: Transaction;
}

export const Transaction = ({ transaction }: TransactionsData) => {
  return (
    <div class="bg-primary-grey p-4 rounded-lg shadow-md mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <div class="p-2 mr-4 bg-primary-grey rounded">
          <span class="text-4xl border-black">{transaction.category?.icon}</span>
        </div>
        <div>
          <h4 class="text-white text-lg">{transaction.company}</h4>
          <p class="text-gray-400 text-sm">{new Date(transaction.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="text-white text-lg">
        -${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
};


export default Transaction;
