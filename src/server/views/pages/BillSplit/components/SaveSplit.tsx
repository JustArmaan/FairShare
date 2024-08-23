import type { Receipt } from "../../../../services/receipt.service";

export const SaveSplit = (props: { transactionsDetails: Receipt }) => {
  return (
    <div class="flex justify-center items-center">
      <button
        type="button"
        id="saveReceipt"
        hx-post={`/billSplit/saveSplit/${props.transactionsDetails[0].id}`}
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-include="[name='splitType'], #splitOptionsRadioButton input, #splitByAmount input, #splitByPercent input"
        class="rounded-md w-[13.4rem] h-10 bg-accent-blue justify-center text-font-off-white text-sm mb-4"
      >
        Save Split
      </button>
    </div>
  );
};
