import { ReceiptItem } from "./ReceiptItem";

export const BillSplitReceipt = (props: {
  transactionsDetails: any;
  receiptItems: any[];
}) => {
  return (
    <div class="w-full bg-pure-white pt-[2.63rem] pb-[7.9rem] px-4 text-font-black flex flex-col">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg mb-[0.63rem]">
          {props.transactionsDetails.companyName}
        </h1>
        <p class="mb-[1.47rem]">{props.transactionsDetails.address}</p>
      </div>
      <div class="flex flex-col px-5 justify-start mb-[0.56rem]">
        <div class="flex">
          <p class="mr-1">Date & Time: </p>
          <p>{props.transactionsDetails.date}</p>
        </div>
        <div class="flex">
          <p class="mr-1">Transaction ID / Details:</p>
          <p>{props.transactionsDetails.transactionId}</p>
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
            <p>$108.00</p>
          </div>
          <div class="flex justify-between">
            <p>Tax:</p>
            <p>$10.80</p>
          </div>
          <div class="flex justify-between">
            <p>Fees:</p>
            <p>$5.40</p>
          </div>
          <div class="flex justify-between mb-4">
            <p>Tips:</p>
            <p>$22.56</p>
          </div>
          <div class="flex justify-between">
            <p class="font-bold">Total:</p>
            <p>$146.76</p>
          </div>
          <div class="flex justify-between">
            <p class="font-bold">Visa Debit ****1234</p>
            <p>($146.76)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
