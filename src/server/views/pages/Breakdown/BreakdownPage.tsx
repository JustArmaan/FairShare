import type { Transactions } from '../../../routes/indexRouter';
import { BudgetCard } from './components/BudgetCard';
import { Graph } from './components/TotalExpenses/Graph';
import { type ArrayElement } from '../transactions/components/Transaction';

type Coordinate = {
  x: number;
  y: number;
};

function floatToCoords(float: number): Coordinate {
  const floatOffset = float + 0.75;
  const theta = 2 * Math.PI * (floatOffset % 1); // get theta with offset such that 0 maps to [0.5, 0]
  const xPrime = Math.cos(theta);
  const yPrime = Math.sin(theta);

  const x = (xPrime + 1) / 2; // maps to [0, 1] from [-1, 1]
  const y = (yPrime + 1) / 2; // ^
  return { x, y };
}

function coordToStyleString({ x, y }: { x: number; y: number }) {
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
}

function rangeToStyleString({ start, end }: { start: number; end: number }) {
  const startCoord = floatToCoords(start);
  const endCoord = floatToCoords(end);
  // need to check every key coord
  // key coords are from 0 to 1 in all intervals of 0.125
  // if we include a key coord, we must add it as a point in our polygon
  let currentCoord = 0;
  const interval = 0.125;
  const keyCoords = [];
  for (let i = 0; i < 1 / interval; i++) {
    keyCoords.push(currentCoord);
    currentCoord += interval;
  }
  const includedCoords = keyCoords.filter(
    (float) => float > start && float < end
  );
  const newPoints = includedCoords
    .map(floatToCoords)
    .map(coordToStyleString)
    .join(' ,');
  return `clip-path: polygon(50% 50%, ${coordToStyleString(startCoord)}, ${
    newPoints && newPoints + ','
  } ${coordToStyleString(endCoord)})`;
}

export type Category = {
  id: number;
  tailwindColorClass: string;
  percentage: number;
  cost: number;
  title: string;
  transactions?: ArrayElement<Transactions>['transactions'][];
};

export function generatePathStyles(categories: Category[]) {
  let startingPercentage = 0;
  return categories.map((category) => {
    const start = startingPercentage;
    const end = startingPercentage + category.percentage;
    startingPercentage += category.percentage;

    return {
      clipPathStyle: rangeToStyleString({ start, end }),
      tailwindColorClass: category.tailwindColorClass,
      title: category.title,
      percentage: `${(category.percentage * 100).toFixed(2)}%`,
      totalCosts: category.cost.toFixed(2),
      categoryId: category.id,
    };
  });
}

function updatePercentages(category: Category, categories: Category[]) {
  const percentage =
    category.cost /
    categories.reduce((sum, category) => sum + category.cost, 0);
  category.percentage = percentage;
  return category;
}

const iconColors = [
  'bg-accent-red',
  'bg-accent-blue',
  'bg-accent-green',
  'bg-accent-yellow',
  'bg-accent-purple',
];

export function mapTransactionsToCategories(transactions: Transactions) {
  const categories = transactions.reduce(
    (categories, transaction, categoryIndex) => {
      console.log(categories);
      const index = categories.findIndex(
        (currentCategory) =>
          currentCategory.title === transaction.categories.name
      );
      if (index === -1) {
        const newCategory: Category = {
          id: transaction.categories.id,
          tailwindColorClass:
            iconColors[categoryIndex % (iconColors.length - 1)], // transaction.categories.color
          cost: transaction.transactions.amount,
          title: transaction.categories.name,
          percentage: 0,
        };

        return [...categories, newCategory];
      } else {
        const category = categories[index];
        category.transactions
          ? category.transactions.push(transaction.transactions)
          : (category.transactions = [transaction.transactions]);
        category.cost = category.transactions.reduce(
          (sum, transaction) => transaction.amount + sum,
          0
        );
        return categories;
      }
    },
    [] as Category[]
  );
  return categories.map((category) => updatePercentages(category, categories));
}

export const BreakdownPage = ({
  transactions,
}: {
  transactions: Transactions;
}) => {
  const categories = mapTransactionsToCategories(transactions);
  const pathStyles = generatePathStyles(categories);
  console.log(
    categories.reduce((sum, category) => category.percentage + sum, 0)
  );

  return (
    <div class="text-font-off-white h-fit w-screen p-8 page">
      <p class="text-2xl">
        <b>April</b>
      </p>
      <p class="text-xl">Monthly Breakdown</p>
      <div class="mt-6">
        <p>
          <b>Total Expenses</b>
        </p>
        <div class="flex flex-row items-center justify-center relative">
          <div>
            <p class="text-3xl text-center mt-6 font-bold pl-2 pr-2">
              ${categories.reduce((sum, category) => category.cost + sum, 0)}
            </p>
            <div class="h-0.5 bg-font-grey rounded mt-0.5 w-full"></div>
          </div>
          {/*<p class="absolute right-0 text-sm text-font-grey">-20% from March</p>*/}
        </div>
      </div>
      <Graph slices={pathStyles} />
      <div class="h-0.5 bg-primary-dark-grey rounded mt-12"></div>
      <div class="h-4"></div> {/* spacer cuz collapsing margins are the devil*/}
      {pathStyles.map((card) => {
        return (
          <BudgetCard
            clipPathStyle={card.clipPathStyle}
            tailwindColorClass={card.tailwindColorClass}
            title={card.title}
            percentage={card.percentage}
            totalCosts={card.totalCosts}
            transactions={transactions.filter(
              (transaction) =>
                transaction.transactions.categoryId === card.categoryId
            )}
          />
        );
      })}
      <div class="h-24" />
    </div>
  );
};
