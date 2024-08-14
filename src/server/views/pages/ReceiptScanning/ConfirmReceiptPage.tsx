import type {
  Receipt,
  ReceiptLineItems,
} from "../../../services/receipt.service";
import { BillSplitReceipt } from "../Groups/components/BillSplitReceipt";

export const ConfirmReceiptPage = (props: {
  transactionsDetails: Receipt;
  receiptItems: ReceiptLineItems[];
}) => {
  const transactionsDetailsJSON = JSON.stringify(props.transactionsDetails);
  const receiptItemsJSON = JSON.stringify(props.receiptItems);

  return (
    <div class="flex flex-col">
      <a
        hx-get="/receipt/addReceipt"
        hx-trigger="click"
        hx-target="#app"
        hx-swap="innerHTML"
        hx-push-url="/receipt/addReceipt"
        class="text-font-off-white text-4xl cursor-pointer w-fit mb-2"
      >
        <img
          src="/icons/arrow_back_ios.svg"
          alt="back arrow icon"
          class="hover:-translate-y-0.5 transition-transform hover:opacity-80 h-6"
        />
      </a>
      <BillSplitReceipt
        transactionsDetails={props.transactionsDetails}
        receiptItems={props.receiptItems}
      />
      <div class="mt-auto p-4 w-full fixed flex bottom-20 flex-col justify-center items-center z-50">
        <form class="flex flex-col justify-center items-center w-full">
          <input
            type="hidden"
            name="transactionsDetails"
            value={transactionsDetailsJSON}
          />
          <input type="hidden" name="receiptItems" value={receiptItemsJSON} />
          <button
            id="edit-receipt-button"
            type="button"
            hx-post="/receipt/editReceipt"
            hx-trigger="click"
            hx-target="#app"
            hx-swap="innerHTML"
            class="bg-accent-blue text-font-off-white py-2 px-4 rounded-lg shadow-md w-[18.12rem] mb-4"
          >
            Edit
          </button>
          <button
            id="confirm-receipt-button"
            type="button"
            class="bg-accent-blue text-font-off-white py-2 px-4 rounded-lg shadow-md w-[18.12rem]"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
