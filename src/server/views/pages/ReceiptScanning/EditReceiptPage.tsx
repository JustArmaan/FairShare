import type { GroupWithMembers } from "../../../services/group.service";
import type {
  Receipt,
  ReceiptLineItems,
} from "../../../services/receipt.service";
import { AddReceiptManuallyPage } from "./AddReceiptManuallyPage";
import { SelectGroup } from "./components/SelectGroup";

export const EditReceiptPage = (props: {
  transactionsDetails: Receipt;
  receiptItems: ReceiptLineItems;
  groups: GroupWithMembers[];
}) => {
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
      <div
        id="errorContainer"
        class="text-accent-red bg-opacity-10 border border-accent-red p-4 rounded shadow hidden text-center mt-4 mb-4"
      ></div>
      <h2 class="text-font-off-white font-semibold text-xl mb-1">
        Select Group
      </h2>
      <SelectGroup groups={props.groups} />
      <AddReceiptManuallyPage
        transactionsDetails={props.transactionsDetails}
        receiptItems={props.receiptItems}
      />
      <div class="mt-auto p-4 w-full fixed flex bottom-20 flex-col justify-center items-center z-50">
        <button
          id="confirm-receipt-button"
          hx-post="/receipt/postReceipt"
          hx-target="#app"
          hx-swap="innerHTML"
          hx-trigger="click"
          hx-include="#items-container input, [name=subtotal], [name=tax], [name=discount], [name=tips], [name=total], [name=storeName], [name=storeAddress], [name=timestamp], [name=selectedGroup]"
          class="bg-accent-blue text-font-off-white py-2 px-4 rounded-lg shadow-md w-[18.12rem]"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
