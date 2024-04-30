export const ChartItem = ({
  tailwindColorClass,
  title,
}: {
  tailwindColorClass: string;
  title: string;
}) => {
  return (
    <div class="flex items-center">
      <div class={`rounded-full w-6 h-6 ${tailwindColorClass} mr-2`} />
      <p>{title}</p>
    </div>
  );
};
