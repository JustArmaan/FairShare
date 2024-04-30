import { BudgetCard } from './components/BudgetCard';
import { Graph } from './components/TotalExpenses/Graph';

export const Breakdown = () => {
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
        <p class="text-3xl text-center mt-2 w-full font-bold underline">
          $3,750
        </p>
      </div>
      <Graph />
      <div class="h-0.5 bg-primary-dark-grey rounded mt-12"></div>
      <div class="h-4"></div> {/* spacer cuz collapsing margins are the devil*/}
      <BudgetCard />
      <BudgetCard />
      <BudgetCard />
    </div>
  );
};
