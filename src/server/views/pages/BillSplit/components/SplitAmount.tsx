import type { GroupWithMembers } from "../../../../services/group.service";
import type { Receipt } from "../../../../services/receipt.service";

export const SplitByAmount = (props: {
  group: GroupWithMembers;
  transactionDetails: Receipt;
}) => {
  return (
    <div class="bg-primary-black text-font-off-white w-full rounded-lg p-4">
      <div class="flex justify-between items-center border-b border-font-grey pb-2 mb-2">
        <p class="font-semibold">Split By Amount</p>
        <button class="text-font-grey">
          <img
            src="/activeIcons/expand_more.svg"
            class="w-4 h-4"
            hx-get={`/billSplit/splitOptions/${props.transactionDetails[0].id}/${props.group.id}?splitType=Amount`}
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
              {member.type === "Owner" && (
                <span class="bg-accent-purple text-white text-xs rounded-full px-2 py-0.5 ml-2">
                  You
                </span>
              )}

              <p class="text-font-grey text-xs ml-4"></p>

              <svg
                class="w-4 h-4 text-font-grey ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12l-4-4-4 4"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
