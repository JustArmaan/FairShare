import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { ReceiptLineItem } from "../../../../services/receipt.service";

export const SplitAmountByItem = (props: {
  receiptItem: ReceiptLineItem;
  groupWithMembers: GroupWithMembers;
  currentUser: UserSchema;
}) => {
  console.log(props, "props");
  return <div>THis is the amount split for each item</div>;
};
