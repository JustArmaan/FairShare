import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { ReceiptLineItem } from "../../../../services/receipt.service";

export const SplitAmountByItem = (props: {
  receiptItem: ReceiptLineItem;
  groupWithMembers: GroupWithMembers;
  currentUser: UserSchema;
}) => {
  const { receiptItem, groupWithMembers } = props;
  const totalOwed = receiptItem.costPerItem * receiptItem.quantity;
  return (
    <div class="flex flex-col space-y-3 w-full my-2">
      <input
        type="hidden"
        name={`itemSplitType`}
        value={`amount-${props.receiptItem.id}`}
      />
      {groupWithMembers.members.map((member, index) => (
        <div
          class="flex justify-between items-center px-2 mb-2"
          id={`member-${member.id}-${receiptItem.id}`}
        >
          <div class="flex items-center">
            <div
              class={`flex rounded-full bg-${member.color} h-[2rem] w-[2rem] justify-center border-2 border-primary-black`}
            >
              <span class="flex justify-center self-center text-center text-xs font-semibold text-font-black">
                {member.firstName[0]}
                {member.lastName ? member.lastName[0] : ""}
              </span>
            </div>

            <div class="ml-4">
              <p class="text-font-off-white font-semibold">
                {member.firstName}
              </p>
              <p class="text-font-grey text-xs">{member.type}</p>{" "}
            </div>
            {member.type === "Owner" && (
              <span class="bg-accent-purple text-white text-xs rounded-[0.25rem] px-2 py-0.5 ml-2 mb-4">
                You
              </span>
            )}
          </div>

          <div class="flex items-center">
            <div class="flex items-center">
              <p class="text-font-grey mr-1">$</p>
              <input
                type="number"
                min="0"
                max={totalOwed}
                name={`splitAmount-${member.id}`}
                step="0.01"
                class="bg-primary-black border border-font-grey text-font-grey w-16 text-right p-1 mr-2 rounded-md"
                placeholder="0.00"
              />
              <div id={`splitOptionsRadioButton${member.id}-${receiptItem.id}`}>
                <img
                  hx-get={`/billSplit/checkSplit/${member.id}/${props.receiptItem.transactionReceiptId}?ischecked=true&receiptItemId=${receiptItem.id}`}
                  hx-swap="innerHTML"
                  hx-target={`#member-${member.id}-${receiptItem.id}`}
                  hx-trigger="click"
                  src="/activeIcons/checked_blue_circle.svg"
                  alt="selected icon"
                  class="ml-1 cursor-pointer"
                />

                <input
                  type="hidden"
                  name={`${true}-${member.id}`}
                  id="selectedIcon"
                  class="split-options-radio"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
