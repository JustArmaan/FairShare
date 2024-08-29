import { receiptLineItem } from "../../../../database/schema/receiptLineItem";
import type { UserSchema } from "../../../../interface/types";
import type { GroupWithMembers } from "../../../../services/group.service";
import type { ReceiptLineItem } from "../../../../services/receipt.service";

export const SplitEquallyByItem = (props: {
  receiptItem: ReceiptLineItem;
  groupWithMembers: GroupWithMembers;
  currentUser: UserSchema;
}) => {
  const splitAmount = (
    props.receiptItem.costPerItem / props.groupWithMembers.members.length
  ).toFixed(2);
  return (
    <div
      class="flex w-full flex-col justify-center items-center my-2"
      id="splitByItemForm"
    >
      <div class="flex flex-col w-full justify-between">
        <input
          type="hidden"
          name={`itemSplitType`}
          value={`equal-${props.receiptItem.id}`}
        />
        {props.groupWithMembers.members.map((member, index) => (
          <div class="flex justify-between items-center w-full px-2 mr-2 mb-2">
            <div class="flex items-center">
              <div
                class={`flex rounded-full bg-${member.color} h-[2rem] w-[2rem] justify-center border-2 border-primary-black`}
              >
                <span class="flex justify-center self-center text-center text-xs font-semibold">
                  {member.firstName[0]}
                  {member.lastName ? member.lastName[0] : ""}
                </span>
              </div>
              <div class="ml-4">
                <p class="text-font-off-white font-semibold">
                  {member.firstName}
                </p>
                <p class="text-font-grey text-xs">{member.type}</p>
              </div>{" "}
              {props.currentUser.id === member.id && (
                <span class="bg-accent-purple text-white text-xs rounded-full px-2 py-0.5 ml-2">
                  You
                </span>
              )}
            </div>

            <div class="flex items-center mr-1">
              <p
                class={`mr-4 ${
                  member.type === "Owner" ? "text-white" : "text-accent-green"
                }`}
              >
                {member.type === "Owner"
                  ? `$${splitAmount}`
                  : `Owe You $${splitAmount}`}
              </p>

              <div
                id={`splitOptionsRadioButton${member.id}-${props.receiptItem.id}`}
              >
                <img
                  hx-get={`/billSplit/checkSplit/${member.id}?ischecked=true&receiptItemId=${props.receiptItem.id}`}
                  hx-swap="innerHTML"
                  hx-trigger="click"
                  hx-target={`#splitOptionsRadioButton${member.id}-${props.receiptItem.id}`}
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
        ))}
      </div>
    </div>
  );
};
