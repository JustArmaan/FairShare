export const ChartItem = ({
  tailwindColorClass,
  title,
}: {
  tailwindColorClass: string;
  title: string;
}) => {
  return (
    <div class="flex items-center">
      <div
        class={`rounded-full h-6 ${tailwindColorClass} mr-2 aspect-square`}
      />
      <p>{title}</p>
    </div>
  );
};
