export const Goal = (props: {
  total: number;
  contribution: number;
  goalName: string;
  goalDescription: string;
}) => {
  return (
    <div
      id="progressContainer"
      class="bg-primary-black w-full h-fit flex flex-col text-font-off-white p-4 mb-4"
    >
      <div id="goal-total" data-total={props.total} />
      <div id="goal-contribution" data-contribution={props.contribution} />
      <div class="flex flex-col justify-start mb-2">
        <p class="font-semibold text-lg">{props.goalName}</p>
        <div class="flex justify-start w-full">
          <p class="text-md w-36 text-medium">Goal Description:</p>
          <p class="text-md w-fit font-light">{props.goalDescription}</p>
        </div>
      </div>
      <div class="flex justify-center">
        <p id="percentageLabel" class="text-2xl font-medium">
          0%
        </p>
      </div>
      <div class="progress-bar-wrapper w-full bg-font-off-white rounded-full overflow-hidden h-6 mt-2 mb-4">
        <div
          id="progressBar"
          class="bg-accent-blue h-full rounded-full transition-all duration-300 ease-in-out"
        ></div>
      </div>
      <div class="flex justify-between mx-8">
        <div class="flex flex-col justify-center items-center">
          <p class="text-md mb-2">Current Contribution</p>
          <p class="text-xl font-medium">${props.contribution.toFixed(2)}</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="text-md mb-2">Goal</p>
          <p class="text-xl font-medium">${props.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Goal;
