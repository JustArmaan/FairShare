import { ChartItem } from './ChartItem';
import { PieChart } from './PieChart';

export const Graph = ({
  slices,
}: {
  slices: {
    clipPathStyle: string;
    tailwindColorClass: string;
    title: string;
    percentage: string;
    totalCosts: string;
  }[];
}) => {
  return (
    <div class="mt-6 flex items-center justify-center">
      <PieChart slices={slices} />
      <div class="ml-6 space-y-4 h-fit">
        {slices.map((slice) => (
          <ChartItem
            tailwindColorClass={slice.tailwindColorClass}
            title={slice.title}
          />
        ))}
      </div>
    </div>
  );
};
