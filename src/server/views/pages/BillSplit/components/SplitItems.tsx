import type { GroupWithMembers } from "../../../../services/group.service";
import type { Receipt } from "../../../../services/receipt.service";

export const SplitByItems = (props: {
  group: GroupWithMembers;
  transactionDetails: Receipt;
}) => {
  return (
    <div class="bg-primary-black text-font-off-white w-full rounded-lg p-4">
      <div class="flex justify-between items-center border-b border-font-grey pb-2 mb-2">
        <p class="font-semibold">Split By Items</p>
        <button class="text-font-grey">
          <img
            src="/activeIcons/expand_more.svg"
            class="w-4 h-4"
            hx-get={`/billSplit/splitOptions/${props.transactionDetails[0].id}/${props.group.id}?splitType=Items`}
            hx-swap="innerHTML"
            hx-target="#split-bill-button"
            hx-trigger="click"
          />
        </button>
      </div>

      <div class="flex flex-col space-y-3">
        {props.group.members.map((member, index) => (
          <div class="flex justify-between items-center">
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
              </div>
            </div>

            <div class="flex items-center">
              {member.type === "Owner" ? (
                <span class="bg-accent-blue text-white text-xs rounded-full px-2 py-0.5 ml-2">
                  You
                </span>
              ) : (
                <p class="text-font-grey text-xs">Member</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
