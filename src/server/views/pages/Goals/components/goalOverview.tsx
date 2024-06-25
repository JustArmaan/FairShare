export const Goal = (props: {
  total: number;
  contribution: number;
  goalName: string;
  goalDescription: string;
}) => {
  return (
    <div
      id="progressContainer"
      class="bg-primary-black-page w-full h-fit flex flex-col text-font-off-white p-4"
    >
      <div id="goal-total" data-total={props.total} />
      <div id="goal-contribution" data-contribution={props.contribution} />
      <div class="flex flex-col justify-start mb-2">
        <p class="font-semibold text-2xl">{props.goalName}</p>
        <div class="flex justify-start">
          <p class="font-semibold w-full">Goal Description:</p>
          <p>{props.goalDescription}</p>
        </div>
      </div>
      <div class="flex justify-center">
        <p id="percentageLabel" class="text-4xl">
          0%
        </p>
      </div>
      <div class="w-full bg-font-off-white rounded-full overflow-hidden h-6 my-4">
        <div
          id="progressBar"
          class="bg-accent-blue h-full rounded-full transition-all duration-300 ease-in-out"
        ></div>
      </div>
    </div>
  );
};

export default Goal;
