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

function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  return date.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const iconColors = [
  "bg-accent-red",
  "bg-accent-blue",
  "bg-accent-green",
  "bg-accent-yellow",
];

const randomIconPaths = [
  "icons/bed.svg",
  "icons/local_dining.svg",
  "icons/local_gas_station.svg",
];

export const Transaction = ({ transaction }: TransactionsData) => {
  return (
    <div class="mt-4 bg-primary-black p-2 rounded-xl shadow-md mb-1 flex items-center justify-between max-w-xl">
      <div class="flex items-center">
        <div
          class={`p-3 pl-4 pr-4 mr-4 ${
            iconColors[Math.floor(Math.random() * (iconColors.length - 1))]
          } rounded-xl`}
        >
          <img
            src={
              randomIconPaths[
                Math.floor(Math.random() * (randomIconPaths.length - 1))
              ]
            }
            alt="category icon for transaction"
          />
        </div>
        <div>
          <h4 class="text-font-off-white text-sm font-bold">
            {transaction.company.split(" ")[0].split(",")[0]}
          </h4>
          <p class="text-gray-400 text-sm text-font-off-white">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
      <div class="text-font-off-white text-md font-bold mr-4">
        ${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
};

export default Transaction;
