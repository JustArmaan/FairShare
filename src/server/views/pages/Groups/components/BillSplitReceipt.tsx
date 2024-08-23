import type {
  Receipt,
  ReceiptLineItems,
} from "../../../../services/receipt.service";
import { ReceiptItem } from "./ReceiptItem";

export const BillSplitReceipt = (props: {
  transactionsDetails: Receipt;
  receiptItems: ReceiptLineItems[];
}) => {
  return (
    <div class="w-full bg-primary-black pt-[2.63rem] pb-[7.9rem] px-4 text-font-off-white flex flex-col rounded-md relative">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg mb-[0.63rem]">
          {props.transactionsDetails[0].storeName}
        </h1>
        <p class="mb-[1.47rem]">{props.transactionsDetails[0].storeAddress}</p>
      </div>
      <div class="flex flex-col px-2 justify-start mb-[1rem]">
        <div class="flex">
          <p class="mr-1">Date & Time: </p>
          <p>{props.transactionsDetails[0].timestamp}</p>
        </div>
        <div class="flex">
          <p class="mr-1">Transaction ID / Details:</p>
          <p>{props.transactionsDetails[0].id}</p>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p class="w-1/2 text-font-grey">Item Name</p>
        <div class="flex justify-end w-full space-x-7">
          <p class="w-1/6 text-center text-font-grey">Qty</p>
          <p class="w-1/6 text-right text-font-grey">Price</p>
        </div>
      </div>

      <hr class="border-t border-font-grey w-full mt-[0.2rem] mb-4 mx-auto" />

      {props.receiptItems.map((receiptItem) => {
        return <ReceiptItem receiptItem={receiptItem} />;
      })}

      <div class="flex flex-col items-end mt-4">
        <div class="w-2/3 max-w-xs">
          <div class="flex justify-between">
            <p>Subtotal:</p>
            <p>${props.transactionsDetails[0].subtotal}</p>
          </div>
          <div class="flex justify-between">
            <p>Tax:</p>
            <p>${props.transactionsDetails[0].tax}</p>
          </div>
          {props.transactionsDetails[0].discount !== undefined && (
            <div class="flex justify-between">
              <p>Discount:</p>
              <p>${props.transactionsDetails[0].discount}</p>
            </div>
          )}
          {props.transactionsDetails[0].tips !== undefined && (
            <div class="flex justify-between mb-4">
              <p>Tips:</p>
              <p>${props.transactionsDetails[0].tips}</p>
            </div>
          )}
          <div class="flex justify-between">
            <p class="font-bold">Total:</p>
            <p>${props.transactionsDetails[0].total}</p>
          </div>
          {props.transactionsDetails.account !== undefined && (
            <div class="flex justify-between">
              <p class="font-bold">Visa Debit ****1234</p>
              <p>($146.76)</p>
            </div>
          )}
        </div>
      </div>

      <svg
        class="absolute bottom-0 left-0 w-full h-8 z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 28"
        preserveAspectRatio="none"
      >
        <polygon
          fill="rgb(24 22 22 / var(--tw-bg-opacity))"
          points="0,28 20,0 40,28 60,0 80,28 100,0 120,28"
          class="text-primary-black"
        />
      </svg>
    </div>
  );
};
