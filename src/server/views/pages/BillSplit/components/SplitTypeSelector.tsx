export const SplitTypeSelector = (props: { selectedType: string }) => {
  return (
    <div
      class="flex space-x-2 bg-light-grey opacity-30 rounded-full w-fit"
      id="splitTypeSelector"
    >
      <button
        class={`${
          props.selectedType === "Equally"
            ? "bg-primary-black text-font-off-white"
            : "text-font-grey"
        } py-1 px-4 rounded-full`}
        hx-get="/billSplit/splitSelector/Equally"
        hx-swap="outerHTML"
        hx-target="#splitTypeSelector"
        hx-trigger="click"
      >
        =
      </button>
      <button
        class={`${
          props.selectedType === "Amount"
            ? "bg-primary-black text-font-off-white"
            : "text-font-grey"
        } py-1 px-4 rounded-full`}
        hx-get="/billSplit/splitSelector/Amount"
        hx-swap="outerHTML"
        hx-target="#splitTypeSelector"
        hx-trigger="click"
      >
        $
      </button>
      <button
        class={`${
          props.selectedType === "Percentage"
            ? "bg-primary-black text-font-off-white"
            : "text-font-grey"
        } py-1 px-4 rounded-full`}
        hx-get="/billSplit/splitSelector/Percentage"
        hx-swap="outerHTML"
        hx-target="#splitTypeSelector"
        hx-trigger="click"
      >
        %
      </button>
      <input type="hidden" name="selectedInput" value={props.selectedType} />
    </div>
  );
};
