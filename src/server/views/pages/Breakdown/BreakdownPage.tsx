import { BudgetCard } from "./components/BudgetCard";
import { Graph } from "./components/TotalExpenses/Graph";
import type { TransactionSchema } from "../../../interface/types";
import { accounts } from "../../../database/schema/accounts";
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
  const interval = 0.01;
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
    .join(" ,");
  return `clip-path: polygon(50% 50%, ${coordToStyleString(startCoord)}, ${
    newPoints && newPoints + ","
  } ${coordToStyleString(endCoord)})`;
}

export type Category = {
  id: string;
  tailwindColorClass: string;
  percentage: number;
  cost: number;
  title: string;
  transactions?: TransactionSchema[];
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
  "bg-accent-red",
  "bg-accent-blue",
  "bg-accent-green",
  "bg-accent-yellow",
  "bg-accent-purple",
];

export function mapTransactionsToCategories(transactions: TransactionSchema[]) {
  const categories = transactions.reduce((categories, transaction) => {
    if (transaction.amount <= 0) return categories;
    const index = categories.findIndex(
      (currentCategory) =>
        currentCategory.title === transaction.category.displayName
    );
    if (index === -1) {
      const newCategory: Category = {
        id: transaction.category.id,
        tailwindColorClass: transaction.category.color,
        cost: transaction.amount,
        title: transaction.category.displayName,
        percentage: 0,
      };

      return [...categories, newCategory];
    } else {
      const category = categories[index];
      category.transactions
        ? category.transactions.push(transaction)
        : (category.transactions = [transaction]);
      category.cost = category.transactions.reduce(
        (sum, transaction) => transaction.amount + sum,
        0
      );
      return categories;
    }
  }, [] as Category[]);
  return categories.map((category) => updatePercentages(category, categories));
}

export const BreakdownPage = ({
  transactions,
  accountName,
  accountId,
  month,
  year,
  url,
  uniqueYearMonth,
}: {
  transactions: TransactionSchema[];
  accountName: string;
  accountId: string;
  month?: number;
  year?: number;
  url: string;
  uniqueYearMonth?: string[];
}) => {
  const categories = mapTransactionsToCategories(transactions);
  const pathStyles = generatePathStyles(categories);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let selectedMonth;
  let selectedYear;

  if (month && year) {
    selectedMonth = month;
    selectedYear = year;
  } else {
    selectedMonth = new Date().getMonth() + 1;
    selectedYear = new Date().getFullYear();
  }

  const dateOptions = uniqueYearMonth?.reverse().map((yearMonth) => {
    const [year, month] = yearMonth.split("-"); 
    return { year, month };
  });

  function extractUniqueYearsWithReduce(yearMonthArray: string[]) {
    const uniqueYearsObj: { [key: string]: boolean } = yearMonthArray?.reduce(
      (acc, yearMonth) => {
        const [year] = yearMonth.split("-");
        acc[year] = true;
        return acc;
      },
      {} as { [key: string]: boolean }
    );

    return Object.keys(uniqueYearsObj);
  }

  const uniqueYears = extractUniqueYearsWithReduce(uniqueYearMonth || []);

  return (
    <div class="text-font-off-white h-fit page animate-fade-in">
      <p class="text-2xl">
        <b>{accountName}</b>
      </p>
      <p class="text-xl">Account Breakdown</p>
      <div
        id="date-selector-form"
        class="bg-primary-black py-1 px-1 my-2 mt-4 shadow-lg flex items-center justify-center w-full border border-font-off-white rounded-full text-primary-gray"
      >
        <form
          id="transactionForm"
          class="flex items-center w-full justify-between px-1"
        >
          <select
            name="year"
            id="yearSelect"
            class="bg-primary-black text-primary-grey outline-none rounded cursor-pointer"
          >
            {uniqueYears?.map((year) => (
              <option value={year} selected={Number(year) === selectedYear}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="month"
            id="monthSelect"
            class="bg-primary-black text-primary-grey outline-none rounded cursor-pointer w-fit"
          >
            {dateOptions?.map((option) => (
              <option
                value={option.month} // Use month directly from each option assuming it's already in 'MM' format
                selected={
                  option.month === selectedMonth.toString().padStart(2, "0")
                }
              >
                {months[Number(option.month) - 1]}
              </option>
            ))}
          </select>
          <input
            type="button"
            value="Reset"
            class="bg-primary-black text-primary-grey cursor-pointer rounded-lg px-4 py-2"
            hx-get={`/breakdown/page/${accountId}`}
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
          />
          <input type="hidden" value={accountId} name="accountId" />
        </form>
      </div>
      <div class="mt-6">
        {transactions.length === 0 ? (
          <p>No transactions for this month</p>
        ) : (
          <>
            <p>
              <b>Total Expenses</b>
            </p>
            <div id="breakdown-data">
              <div>
                <div class="flex flex-col items-center justify-center relative">
                  <p class="text-3xl text-center mt-6 font-bold pl-2 pr-2">
                    $
                    {categories
                      .reduce((sum, category) => category.cost + sum, 0)
                      .toFixed(2)}
                  </p>
                  <div class="h-0.5 bg-font-grey rounded mt-0.5 w-full"></div>
                </div>
                {/*<p class="absolute right-0 text-sm text-primary-grey">-20% from March</p>*/}
              </div>
              <Graph slices={pathStyles} />
              <div class="h-0.5 bg-primary-dark-grey rounded mt-12"></div>
              <div class="h-4"></div>{" "}
              {/* spacer cuz collapsing margins are the devil*/}
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
                        transaction.categoryId === card.categoryId
                    )}
                    url={url}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
