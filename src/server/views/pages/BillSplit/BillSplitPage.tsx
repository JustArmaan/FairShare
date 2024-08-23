import type { UserSchema } from "../../../interface/types";
import type { GroupWithMembers } from "../../../services/group.service";
import type {
  Receipt,
  ReceiptLineItems,
} from "../../../services/receipt.service";
import { BillSplitReceipt } from "../Groups/components/BillSplitReceipt";
import { GroupOverview } from "./components/GroupOverview";

export const BillSplitPage = (props: {
  transactionsDetails: Receipt;
  receiptItems: ReceiptLineItems;
  group: GroupWithMembers;
  currentUser: UserSchema;
  splitType: string;
}) => {
  return (
    <>
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

      <GroupOverview
        group={props.group}
        transactionsDetails={props.transactionsDetails}
      />
      <div
        class="flex justify-center items-center mt-3 mb-4 "
        id="split-bill-button"
      >
        <button
          type="button"
          hx-get={`/billSplit/changeSplitOption/${props.transactionsDetails[0].id}/${props.group.id}?splitType=Equally`}
          hx-target="#split-bill-button"
          hx-swap="innerHTML"
          class="rounded-md w-[13.4rem] h-10 bg-accent-blue justify-center text-font-off-white text-sm my-2"
        >
          Split Bill
        </button>
      </div>
      <form>
        <div id="saveSplitButton" />

        <h2 class="text-font-off-white text-xl font-semibold mb-[0.75rem]">
          Receipt Details:
        </h2>

        <BillSplitReceipt
          transactionsDetails={props.transactionsDetails}
          receiptItems={[props.receiptItems]}
          splitType={props.splitType}
        />
      </form>
    </>
  );
};
