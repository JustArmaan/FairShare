import type { ReceiptLineItems } from "../../../../services/receipt.service";

export const SplitTypeSelector = (props: {
  selectedType: string;
  receiptLineItem: ReceiptLineItems;
}) => {
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
        hx-get={`/billSplit/splitSelector/Equally/${props.receiptLineItem[0].id}`}
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
        hx-get={`/billSplit/splitSelector/Amount/${props.receiptLineItem[0].id}`}
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
        hx-get={`/billSplit/splitSelector/Percentage/${props.receiptLineItem[0].id}`}
        hx-swap="outerHTML"
        hx-target="#splitTypeSelector"
        hx-trigger="click"
      >
        %
      </button>
      <input type="hidden" name="splitType" value={props.selectedType} />
    </div>
  );
};
