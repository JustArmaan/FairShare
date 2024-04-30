import { ChartItem } from './ChartItem';
import { PieChart } from './PieChart';

export const Graph = () => {
  return (
    <div class="mt-6 flex items-center">
      <PieChart />
      <div class="ml-6 space-y-4 h-fit">
        <ChartItem tailwindColorClass="bg-accent-red" title="Food" />
        <ChartItem tailwindColorClass="bg-accent-purple" title="Rent" />
        <ChartItem tailwindColorClass="bg-accent-blue" title="Utilities" />
      </div>
    </div>
  );
};
