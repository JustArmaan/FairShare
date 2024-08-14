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
    <div class="w-full bg-primary-black pt-[2.63rem] pb-[7.9rem] px-4 text-font-off-white flex flex-col">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg mb-[0.63rem]">
          {props.transactionsDetails[0].storeName}
        </h1>
        <p class="mb-[1.47rem]">{props.transactionsDetails[0].storeAddress}</p>
      </div>
      <div class="flex flex-col px-5 justify-start mb-[0.56rem]">
        <div class="flex">
          <p class="mr-1">Date & Time: </p>
          <p>{props.transactionsDetails[0].timestamp}</p>
        </div>
        <div class="flex">
          <p class="mr-1">Transaction ID / Details:</p>
          <p>{props.transactionsDetails[0].id}</p>
        </div>
      </div>
      <hr class="border-t border-font-black w-full my-1 mx-auto px-2 mb-3" />
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
          {props.transactionsDetails[0].discount !== undefined ?? (
            <div class="flex justify-between">
              <p>Discount:</p>
              <p>${props.transactionsDetails[0].discount}</p>
            </div>
          )}
          {props.transactionsDetails[0].tips !== undefined ?? (
            <div class="flex justify-between mb-4">
              <p>Tips:</p>
              <p>${props.transactionsDetails[0].tips}</p>
            </div>
          )}
          <div class="flex justify-between">
            <p class="font-bold">Total:</p>
            <p>${props.transactionsDetails[0].total}</p>
          </div>
          {props.transactionsDetails.account !== undefined ?? (
            <div class="flex justify-between">
              <p class="font-bold">Visa Debit ****1234</p>
              <p>($146.76)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
