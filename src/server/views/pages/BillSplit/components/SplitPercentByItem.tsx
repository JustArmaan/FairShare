import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { ReceiptLineItem } from "../../../../services/receipt.service";

export const SplitPercentByItem = (props: {
  receiptItem: ReceiptLineItem;
  groupWithMembers: GroupWithMembers;
  currentUser: UserSchema;
}) => {
  return <div>This is the split by percent for each item</div>;
};
