import { ChartItem } from "./ChartItem";
import { PieChart } from "./PieChart";

export const Graph = (props: {
  home?: boolean;
  accountId?: string;
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
      <PieChart
        slices={props.slices}
        home={props.home}
        accountId={props.accountId}
      />
      <div class="ml-6 space-y-4 h-fit">
        {props.slices.map((slice) => (
          <ChartItem
            tailwindColorClass={slice.tailwindColorClass}
            title={slice.title}
          />
        ))}
      </div>
    </div>
  );
};
