import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { ReceiptLineItems } from "../../../../services/receipt.service";
import { SplitAmountByItem } from "./SplitAmountByItem";
import { SplitEquallyByItem } from "./SplitEquallyByItem";
import { SplitPercentByItem } from "./SplitPercentByItem";
import { SplitTypeSelector } from "./SplitTypeSelector";

export const SplitByItemsForm = (props: {
  receiptItems: ReceiptLineItems;
  groupWithMembers: GroupWithMembers;
  splitType: string;
  currentUser: UserSchema;
}) => {
  return (
    <div
      class="bg-primary-faded-black w-full pb-2 pt-1 flex flex-col justify-center mb-2"
      id={`splitForm-${props.receiptItems[0].id}`}
    >
      <div class="flex  px-2 items-center">
        <p class="w-1/2 text-font-off-white">
          {props.receiptItems[0].productName}
        </p>
        <p class="w-1/6 text-center text-font-off-white">
          {props.receiptItems[0].quantity}
        </p>
        <p class="w-1/6 text-right text-font-off-white">
          ${props.receiptItems[0].costPerItem}
        </p>
        <p class="ml-2 text-font-grey text-sm">Undo</p>
      </div>
      <hr class="border-t border-font-grey w-full mt-2 mb-2" />
      <div class="flex justify-center items-center">
        <SplitTypeSelector
          selectedType={props.splitType}
          receiptLineItem={props.receiptItems}
        />
      </div>
      {props.splitType === "Equally" && (
        <SplitEquallyByItem
          groupWithMembers={props.groupWithMembers}
          receiptItem={props.receiptItems[0]}
          currentUser={props.currentUser}
        />
      )}
      {props.splitType === "Percentage" && (
        <SplitPercentByItem
          groupWithMembers={props.groupWithMembers}
          receiptItem={props.receiptItems[0]}
          currentUser={props.currentUser}
        />
      )}
      {props.splitType === "Amount" && (
        <SplitAmountByItem
          groupWithMembers={props.groupWithMembers}
          receiptItem={props.receiptItems[0]}
          currentUser={props.currentUser}
        />
      )}
    </div>
  );
};
