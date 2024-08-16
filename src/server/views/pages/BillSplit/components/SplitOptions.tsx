const options = [
  { name: "Split Equally", value: "Equally" },
  { name: "Split By Amount", value: "Amount" },
  { name: "Split By Percentage", value: "Percentage" },
  { name: "Split By Items", value: "Items" },
  { name: "Undo Split", value: "Undo" },
];

export const SplitOptions = (props: {
  splitType: string;
  receiptId: string;
}) => {
  return (
    <div
      class="bg-primary-black text-font-off-white w-full rounded-lg p-4 my-4"
      id="splitOptions"
    >
      <div class="flex items-center border-b border-font-grey pb-2 mb-2">
        <p
          id="splitType"
          class="font-semibold text-accent-blue flex-grow text-center"
        >
          Split {props.splitType}
        </p>
        <img
          src="/activeIcons/expand_more.svg"
          hx-get={`/billSplit/overview/${props.receiptId}`}
          hx-trigger="click"
          hx-target="#app"
          hx-swap="innerHTML"
          class="cursor-pointer w-[24px] aspect-square flex-shrink-0"
        />
      </div>

      <div class="flex flex-col space-y-2">
        {options.map((option) => {
          const isSelected = option.value === props.splitType;

          if (!isSelected) {
            return (
              <button
                class={`w-full text-center py-1 px-3 rounded-md ${
                  option.value === "Undo"
                    ? "text-font-grey"
                    : "text-font-off-white"
                } hover:bg-primary-black hover:text-font-off-white`}
                hx-get={`/billSplit/splitOptions/${props.receiptId}?splitType=${option.value}`}
                hx-swap="outerHTML"
                hx-target="#splitOptions"
              >
                {option.name}
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
