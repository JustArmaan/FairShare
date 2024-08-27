import type { GroupWithMembers } from "../../../../services/group.service";
import type { Receipt } from "../../../../services/receipt.service";

export const SplitByPercentage = (props: {
  group: GroupWithMembers;
  transactionDetails: Receipt;
}) => {
  return (
    <div class="bg-primary-black text-font-off-white w-full rounded-lg p-4">
      <div class="flex justify-center items-center border-b border-font-grey pb-2 mb-2">
        <p class="font-semibold">Split By Percentage</p>
        <button class="text-font-grey">
          <img
            src="/activeIcons/expand_more.svg"
            class="w-4 h-4 ml-2"
            hx-get={`/billSplit/splitOptions/${props.transactionDetails[0].id}/${props.group.id}?splitType=Percentage`}
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
              {member.type === "Owner" && (
                <span class="bg-accent-purple text-white text-xs rounded-full px-2 py-0.5 ml-2">
                  You
                </span>
              )}
            </div>

            <div class="flex items-center" id="splitByPercent">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                name={`splitPercentage-${member.id}`}
                class="bg-primary-black border border-font-grey text-font-grey w-16 text-right p-1 mr-2 rounded-md"
                placeholder="0"
              />
              <p class="text-font-grey">%</p>

              <div id={`splitOptionsRadioButton${member.id}`}>
                <img
                  hx-get={`/billSplit/checkSplit/${member.id}?ischecked=true`}
                  hx-swap="innerHTML"
                  hx-trigger="click"
                  hx-target={`#splitOptionsRadioButton${member.id}`}
                  src="/activeIcons/checked_blue_circle.svg"
                  alt="selected icon"
                  class="ml-1 cursor-pointer"
                />

                <input
                  type="hidden"
                  name={`${true}-${member.id}`}
                  id="selectedIcon"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
