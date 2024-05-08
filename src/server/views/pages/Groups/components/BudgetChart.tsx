interface groupBudget {
  budgetGoal: string;
  spending: string;
}

export const BudgetChart = ({
  groupBudget,
}: {
  groupBudget: groupBudget[];
}) => {
  const amountSpent = 2825.0;
  const totalBudget = 4000.0;
  const leftToSpend = totalBudget - amountSpent;

  if (leftToSpend < 0) {
  }

  function calculateCircle() {
    const circumference = 2 * Math.PI * 135;
    const percentageSpent = (amountSpent / totalBudget) * 100;
    const dashOffset = String(circumference * (1 - percentageSpent / 100));
    console.log(dashOffset);
    return dashOffset;
  }

  // const circleElement = document.querySelector('.progress-ring__circle');
  // if (circleElement) {
  //   circleElement.setAttribute('stroke-dashoffset', dashOffset);
  // } else {
  //   console.error("Circle not found");
  // }
  return (
    <div class="rounded-lg w-full bg-font-black">
      <div class="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-lg w-full bg-font-black">
        <div class="flex justify-center items-center w-96 h-96 relative">
          <div class="rounded-full border-4 border-white w-72 h-72 flex flex-col justify-center items-center bg-card-black relative">
            <p class="text-pure-white font-semibold text-5xl">${leftToSpend}</p>
            <p class="text-pure-white text-sm">Left to spend this month</p>
            <p class="text-pure-white text-sm font-bold">
              Out of ${totalBudget}
            </p>
          </div>
          <div class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <svg class="w-[300px] h-[300px]">
              <circle
                class="stroke-current"
                stroke="#343434"
                stroke-width="30"
                cx="50%"
                cy="50%"
                r="135"
                fill="transparent"
              ></circle>
              <circle
                stroke-dashOffset={calculateCircle()}
                class="shadow-bottom stroke-current progress-ring_circle"
                stroke="#F0F0F0"
                stroke-width="25"
                stroke-linecap="round"
                cx="50%"
                cy="50%"
                r="135"
                fill="transparent"
                stroke-dasharray="848.23"
              ></circle>
            </svg>
          </div>
        </div>
      </div>
      {/* <div class="flex flex-row justify-between items-center m-2">
        <p class="text-font-off-white text-lg">Insights</p>
        <button
          hx-swap="innerHTML"
          hx-get="/breakdown/page"
          hx-target="#app"
          hx-push-url="true"
          // rotate 0.0001deg prevents strange subpixel snapping during animation when viewport is 430px wide. I spent 15 mins on this.
          // https://stackoverflow.com/questions/24854640/strange-pixel-shifting-jumping-in-firefox-with-css-transitions
          class="hover:-translate-y-0.5 rotate-[0.0001deg] transition-transform px-3 bg-accent-blue rounded-xl h-6 text-font-off-white"
        >
          Details
        </button>
      </div>
      <div>
        <p>You're $</p>
      </div> */}
    </div>
  );
};

export default BudgetChart;
